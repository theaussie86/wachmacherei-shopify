'use client';

import { cookieConfigurations } from 'lib/context/cookies';

function CookieTable() {
  return (
    <>
      {Object.entries(cookieConfigurations).map(([key, { name, description, services }]) => (
        <div key={key}>
          <h4 className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">Kategorie - {name}</h4>
          <div className="break-words px-3 py-4 text-sm">{description}</div>
          {services && (
            <div className="grid grid-cols-[repeat(3,minmax(0,max-content))] border p-2">
              <div className="border-b-2 py-3.5 pl-4 pr-3 text-left text-sm font-medium sm:pl-0">
                Dienst
              </div>
              <div className="border-b-2 px-3 py-3.5 text-left text-sm font-medium ">
                Beschreibung
              </div>
              <div className="border-b-2 px-3 py-3.5 text-left text-sm font-medium ">URL</div>
              {Object.entries(services).map(([key, { name, purpose, url }]) => (
                <>
                  <div key={key} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                    {name}
                  </div>
                  <div key={key} className="break-words px-3 py-4 text-sm">
                    {purpose}
                  </div>
                  <div key={key} className="break-words px-3 py-4 text-sm">
                    {url}
                  </div>
                </>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
}

export default CookieTable;
