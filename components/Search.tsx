import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import { lng } from "assets/translations";
import useTranslation from "hooks/useTranslation";
import clsx from "clsx";
import IconButton from "components/ui/IconButton";
import AppContext from "context/AppContext";
import {
  setMetaThemeColor,
  THEMES_META,
  THEME_MODE_BACKGROUNDS,
} from "lib/themes";
import { City } from "types";
import { fetchCityAndWeatherData } from "lib/fetchData";
import LocationContext from "context/LocationContext";
import CityList from "./ui/CityList";
import { getLocalStorage, setLocalStorage } from "lib/storage";
import { MAX_FAVORITES } from "consts";
import ListItem from "./ui/ListItem";
import Icon from "./ui/Icon";
import searchCities from "@/lib/searchCities";

interface SearchProps {
  open?: boolean;
  onClose?: () => void;
}

export default function Search({ open, onClose }: SearchProps) {
  const t = useTranslation();
  const router = useRouter();
  const { language, units, theme, themeMode } = useContext(AppContext);
  const { currentCity, setLocation, locationState, defineLocation } =
    useContext(LocationContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const fetchCities = useCallback(searchCities(), []);
  const [cities, setCities] = useState<City[]>([]);
  const [favorites, setFavorites] = useState<City[]>([]);
  const [favoritesEdit, setFavoritesEdit] = useState(false);

  const [value, setValue] = useState("");

  function handleClose() {
    if (onClose) onClose();
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
    setFavoritesEdit(false);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") handleClose();
  }

  function handleClear() {
    setValue("");
    inputRef.current?.focus();
  }

  function checkRoute() {
    if (!["/", "/5-days"].includes(router.pathname)) {
      router.push("/");
    }
  }

  function handleCityClick(lat: number, lon: number) {
    setLocation(lat, lon);
    checkRoute();
    handleClose();
  }

  function handleCurrentCityClick() {
    if (!currentCity) return;
    setLocation(currentCity.lat, currentCity.lon);
    checkRoute();
    handleClose();
  }

  function findFavoriteIndex(latitude: number, longitude: number) {
    return favorites.findIndex(
      ({ lat, lon }) => latitude === lat && longitude === lon
    );
  }

  function saveFavorites(cities: City[]) {
    setLocalStorage({
      favoriteCities: cities.map(({ lat, lon }) => {
        return { lat, lon };
      }),
    });
  }

  async function toggleFavoriteCity(latitude: number, longitude: number) {
    const cities = [...favorites];
    const favoriteIndex = findFavoriteIndex(latitude, longitude);

    if (favoriteIndex >= 0) {
      cities.splice(favoriteIndex, 1);
    } else {
      const city = await fetchCityAndWeatherData(
        latitude,
        longitude,
        language,
        units
      );
      if (city) {
        cities.unshift({ ...city, lat: latitude, lon: longitude });
        if (cities.length > MAX_FAVORITES) cities.pop();
      }
    }

    saveFavorites(cities);
    setFavorites(cities);
    inputRef.current?.focus();
  }

  function isCityFavorite(latitude: number, longitude: number) {
    return findFavoriteIndex(latitude, longitude) >= 0;
  }

  useEffect(() => {
    async function checkFavoriteCities() {
      console.log("favorites", language, units);

      const favorites = getLocalStorage().favoriteCities || [];
      const cities = await Promise.all<City>(
        favorites.map(async (city) => {
          const cityData = await fetchCityAndWeatherData(
            city.lat,
            city.lon,
            language,
            units
          );
          return cityData || city;
        })
      );

      setFavorites(cities);
    }
    const timer = setTimeout(() => checkFavoriteCities(), 1000);

    return () => clearTimeout(timer);
  }, [language, units]);

  useEffect(() => {
    setMetaThemeColor(
      open ? THEME_MODE_BACKGROUNDS[themeMode] : THEMES_META[theme].color
    );
  }, [theme, themeMode, open]);

  useEffect(() => {
    async function getData(q: string) {
      setCities(await fetchCities(q, language));
    }
    getData(value);
  }, [value, language]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    setValue("");
    setFavoritesEdit(false);
    document.body.classList.toggle("no-scroll", open);
  }, [open]);

  return (
    <div
      className={clsx(
        "inset-0 flex justify-center",
        open ? "fixed z-20" : "hidden"
      )}
    >
      <div
        className={clsx(
          `bg-background w-full p-2 sm:p-4 
          overflow-hidden flex flex-col
          aminate-tr scale-80 opacity-0 origin-top`,
          open && "animate-appear"
        )}
      >
        <div className="flex gap-2 items-center">
          <IconButton
            icon="back"
            className={clsx(
              "text-text-secondary rotate-[270deg]",
              open && "animate-rotate"
            )}
            onClick={handleClose}
          />
          <input
            type="text"
            ref={inputRef}
            size={0}
            value={value}
            placeholder={t(lng.searchPlaces)}
            spellCheck={false}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={clsx(
              `bg-transparent text-xl w-full min-w-0
            placeholder:text-text-secondary
            focus:outline-none
            selection:text-primary-dark selection:bg-primary-200`
            )}
          />
          {value !== "" && (
            <IconButton
              icon="close"
              className="text-text-secondary"
              onClick={handleClear}
            />
          )}
        </div>

        {cities.length === 0 ? (
          value === "" ? (
            <>
              {currentCity ? (
                <CityList
                  type="current"
                  cities={[currentCity]}
                  onClick={handleCurrentCityClick}
                />
              ) : (
                locationState !== "granted" && (
                  <ListItem
                    responsive
                    primary={t(
                      locationState === "not-requested"
                        ? lng.locationUnavailable
                        : locationState === "denied"
                        ? lng.locationDenied
                        : locationState === "unavailable"
                        ? lng.locationUnavailable
                        : lng.locationTimeout
                    )}
                    secondary={t(
                      locationState === "not-requested"
                        ? lng.locationImprove
                        : lng.locationTryAgain
                    )}
                    onClick={
                      locationState === "not-requested"
                        ? defineLocation
                        : undefined
                    }
                    startDecoration={
                      <Icon type="location-off" className="text-red-500" />
                    }
                    asButton={locationState === "not-requested"}
                  />
                )
              )}
              {favorites.length > 0 && (
                <h3 className="flex text-text-secondary justify-between mt-6 px-6">
                  {t(lng.favorites)}
                  <button
                    onClick={() => setFavoritesEdit((current) => !current)}
                  >
                    {t(
                      favoritesEdit
                        ? lng.favoritesEditFinish
                        : lng.favoritesEdit
                    )}
                  </button>
                </h3>
              )}

              <CityList
                type="favorites"
                cities={favorites}
                favoritesEdit={favoritesEdit}
                onClick={handleCityClick}
                onToggleFavorite={toggleFavoriteCity}
              />
            </>
          ) : (
            <div className="text-text-secondary text-center pt-4 py-2">
              {t(lng.noCitiesFound)}
            </div>
          )
        ) : (
          <CityList
            type="search"
            cities={cities}
            onClick={handleCityClick}
            onToggleFavorite={toggleFavoriteCity}
            isCityFavorite={isCityFavorite}
          />
        )}
      </div>
    </div>
  );
}
