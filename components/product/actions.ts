'use server';

import { TAGS } from 'lib/constants';
import { getCart, updateCart } from 'lib/shopify';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function updateCourseItem(
  handle: string,
  email: string,
  date: string,
  action: 'add' | 'remove'
) {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  try {
    const cart = await getCart(cartId);
    if (!cart) {
      return 'Cart not found';
    }

    const line = cart.lines.find(
      (line) =>
        line.merchandise.product.handle === handle &&
        line.attributes.find((attr) => attr.key === 'Datum' && attr.value === date)
    );

    if (!line) {
      return 'Line not found';
    }

    const teilnehmer = line.attributes.filter((attr) => attr.key.endsWith('Teilnehmer'));
    if (action === 'add') {
      teilnehmer.push({ key: `${teilnehmer.length + 2}. Teilnehmer`, value: email });
    } else if (action === 'remove') {
      // remove the email from the list of participants
      const removeIndex = teilnehmer.findIndex((attr) => attr.value === email);
      teilnehmer.splice(removeIndex, 1);
      teilnehmer.forEach((attr, index) => {
        attr.key = `${index + 2}. Teilnehmer`;
      });
    }

    // update the line item attributes
    line.attributes = [
      ...line.attributes.filter((attr) => !attr.key.endsWith('Teilnehmer')),
      ...teilnehmer
    ];

    // update the quantity of the line item
    line.quantity = teilnehmer.length + 1;

    await updateCart(cartId, [
      {
        id: line.id,
        merchandiseId: line.merchandise.id,
        quantity: line.quantity,
        attributes: line.attributes
      }
    ]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error updating item quantity';
  }
}
