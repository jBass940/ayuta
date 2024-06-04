import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

type Link = {
  route: string;
  icon: string;
  size: number;
};

const routeToValue: Record<string, number> = {
  "/guests": 0,
  "/search": 1,
  "/chats": 2,
  "/shop": 3,
};

const links: Link[] = [
  {
    route: "guests",
    icon: "eye",
    size: 50,
  },
  {
    route: "search",
    icon: "search",
    size: 30,
  },
  {
    route: "chats",
    icon: "chat",
    size: 30,
  },
  {
    route: "shop",
    icon: "basket",
    size: 30,
  },
];

const MenuItem = ({ iconName, size }: { iconName: string; size: number }) => {
  const sizeValue = `${size}px`;

  return (
    <Box sx={{ height: "64px", display: "flex" }}>
      <Box
        sx={{
          width: sizeValue,
          height: sizeValue,
          backgroundImage: `url(/${iconName}.svg)`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          margin: "auto",
        }}
      />
    </Box>
  );
};

const BaseNavigation = () => {
  const navigate = useNavigate();
  let location = useLocation();

  const [value, setValue] = React.useState(routeToValue[location.pathname] || 0);

  useEffect(() => {
    setValue(routeToValue[location.pathname]);
  }, [location.pathname]);

  return (
    <BottomNavigation
      value={value}
      onChange={(_, newValue) => {
        setValue(newValue);
      }}
      sx={{
        display: {
          md: "flex",
          lg: "none",
        },
      }}
    >
      {links.map((link, index) => {
        const iconName = value === index ? `${link.icon}Purple` : `${link.icon}Dark`;

        return (
          <BottomNavigationAction key={index} icon={<MenuItem iconName={iconName} size={link.size} />} onClick={() => navigate(`/${link.route}`)} />
        );
      })}
    </BottomNavigation>
  );
};

export default BaseNavigation;
