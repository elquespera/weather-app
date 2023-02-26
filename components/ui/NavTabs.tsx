import { APP_TITLE, ROUTES } from "@/consts";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import Icon from "./Icon";

type NavTabItem = {
  title: string;
  route: string;
};

export default function NavTabs() {
  const navRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const selectedIndex = ROUTES.findIndex(
    ({ route }) => route === router.pathname
  );
  const currentRoute = ROUTES[selectedIndex];

  useEffect(() => {
    let title = APP_TITLE;
    if (currentRoute) title += ` | ${currentRoute.title}`;
    document.title = title;
  }, [currentRoute, router]);

  useEffect(() => {
    const tabWidth = 8;
    if (navRef.current) {
      navRef.current.style.setProperty(
        "--wapp-tab-offset",
        `${tabWidth * (selectedIndex || 0)}em`
      );
    }
  }, [navRef, selectedIndex]);

  return (
    <nav ref={navRef}>
      <ul
        className={clsx(
          `relative flex
          text-sm
          sm:text-base
          after:absolute after:left-0 after:bottom-0 after:h-1 after:w-tab 
          after:translate-x-tab-offset
          after:transition-transform
          after:rounded-t-md
          after:bg-primary-100`,
          selectedIndex < 0 && "after:scale-0"
        )}
      >
        {ROUTES.map(({ title, route, icon }, index) => {
          return (
            <li key={route}>
              <Link
                className={clsx(
                  `inline-flex items-center justify-center 
                  w-tab gap-2 px-2 pt-2 pb-3 rounded-t-sm
                  transition-colors
                  focus:outline-none focus:bg-primary-700
                  hover:bg-primary-700`,
                  index === selectedIndex && "text-primary-200"
                )}
                href={route}
              >
                {title}
                <Icon type={icon} size="small" />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
