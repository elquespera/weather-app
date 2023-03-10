import { lng } from "@/assets/translations";
import useTranslation from "@/hooks/useTranslation";
import clsx from "clsx";
import { City } from "types";
import Temperature from "../Temperature";
import Icon from "./Icon";
import IconButton from "./IconButton";
import ListItem from "./ListItem";
import WeatherIcon from "./WeatherIcon";

interface CityListProps {
  type: "current" | "search" | "favorites";
  cities: City[];
  selected?: City;
  favoritesEdit?: boolean;
  isCityFavorite?: (latitude: number, longitude: number) => boolean;
  onClick?: (city: City) => void;
  onToggleFavorite?: (latitude: number, longitude: number) => void;
}

export default function CityList({
  type,
  cities,
  selected,
  favoritesEdit,
  isCityFavorite,
  onClick,
  onToggleFavorite,
}: CityListProps) {
  const t = useTranslation();
  const asButton =
    type === "current" || (type === "favorites" && !favoritesEdit);

  function handleCityClick(city: City) {
    if (onClick) onClick(city);
  }

  function toggleFavoriteCity(latitude: number, longitude: number) {
    if (onToggleFavorite) onToggleFavorite(latitude, longitude);
  }

  return (
    <ul
      className={clsx(type === "current" ? "flex-shrink-0" : "overflow-auto")}
    >
      {cities.map((city, index) => {
        const { name, country, lat, lon, weather } = city;
        return (
          <ListItem
            key={index}
            responsive
            highlight={selected === city}
            primary={<span className="text-text">{name}</span>}
            secondary={type === "current" ? t(lng.yourLocation) : country}
            startDecoration={
              <Icon
                type={
                  type === "current"
                    ? "near"
                    : type === "search"
                    ? "location"
                    : "star-filled"
                }
                className={clsx(
                  type === "current"
                    ? "text-blue-500"
                    : type === "favorites"
                    ? "text-yellow-500"
                    : "text-text-secondary"
                )}
              />
            }
            middleDecoration={
              weather && (
                <div className="flex items-center">
                  <Temperature
                    value={weather.temp}
                    className="text-primary-header text-xl sm:text-2xl"
                  />
                  <WeatherIcon icon={weather.icon} alt={weather.description} />
                </div>
              )
            }
            endDecoration={
              (type === "search" ||
                (type === "favorites" && favoritesEdit)) && (
                <IconButton
                  className={clsx(
                    type === "search" &&
                      isCityFavorite &&
                      isCityFavorite(lat, lon)
                      ? "text-yellow-500"
                      : "text-text-secondary"
                  )}
                  icon={
                    type === "favorites"
                      ? "close"
                      : isCityFavorite && isCityFavorite(lat, lon)
                      ? "star-filled"
                      : "star"
                  }
                  onClick={() => toggleFavoriteCity(lat, lon)}
                />
              )
            }
            asButton={asButton}
            ignoreEndDecorationClick
            hover
            onClick={() => handleCityClick(city)}
          />
        );
      })}
    </ul>
  );
}
