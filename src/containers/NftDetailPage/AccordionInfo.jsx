import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";

export default function AccordionInfo(props) {
  return (
    <div className="w-full rounded-2xl">
      <Disclosure defaultOpen>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between w-full px-4 py-2 font-medium text-left bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-500 rounded-lg hover:bg-neutral-200 focus:outline-none focus-visible:ring focus-visible:ring-neutral-500 focus-visible:ring-opacity-75">
              <span>Descriptions</span>
              <ChevronUpIcon
                className={`${
                  open ? "transform rotate-180" : ""
                } w-5 h-5 text-neutral-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel
              className="px-4 pt-4 pb-2 text-neutral-500 text-sm dark:text-neutral-400"
              as="p"
            >
              {props.state.description}
              {/* Tattooed Kitty Gang (“TKG”) is a collection of 666 badass kitty
              gangsters, with symbol of tattoos, living in the Proud Kitty Gang
              (“PKG”) metaverse. Each TKG is an 1/1 ID as gangster member & all
              the joint rights. */}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <Disclosure defaultOpen as="div" className="mt-5 md:mt-8">
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between w-full px-4 py-2 font-medium text-left bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-500 rounded-lg hover:bg-neutral-200 focus:outline-none focus-visible:ring focus-visible:ring-neutral-500 focus-visible:ring-opacity-75">
              <span>Details</span>
              <ChevronUpIcon
                className={`${
                  open ? "transform rotate-180" : ""
                } w-5 h-5 text-neutral-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 flex flex-col text-xs text-neutral-500 dark:text-neutral-400 overflow-hidden">
              <span>
                IMAGE
                {"(" +
                  (Math.round(props.state.fileSize / 1024).toFixed(2) +
                    " Kbs") +
                  ")"}
              </span>
              <br />
              <span>Contract Address</span>
              <span className="text-base text-neutral-900 dark:text-neutral-100 line-clamp-1">
                {props.state.contractAddress}
              </span>

              <br />
              <span>Token ID</span>
              <span className="text-base text-neutral-900 dark:text-neutral-100">
                {props.state.tokenId}
              </span>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
