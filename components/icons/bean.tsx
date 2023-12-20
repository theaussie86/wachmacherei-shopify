export default function BeanIcon(props: React.ComponentProps<'svg'> & { isActive?: boolean }) {
  const { stroke, fill, isActive, ...rest } = props;
  return (
    <svg
      width="981"
      height="1086"
      viewBox="0 0 981 1086"
      fill="none"
      {...rest}
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="490.5"
        cy="543"
        rx="305.5"
        ry="450"
        transform="rotate(-30 490.5 543)"
        stroke={stroke || 'currentColor'}
        fill={isActive ? '#E8B428' : 'none'}
        strokeWidth="32"
      />
      <path
        d="M702.077 940.461C702.077 940.461 384.688 782.228 484.716 563.982C584.745 345.736 252.077 161.039 252.077 161.039"
        stroke={stroke || 'currentColor'}
        strokeWidth="32"
      />
    </svg>
  );
}
