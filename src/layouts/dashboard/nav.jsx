import PropTypes from "prop-types";
import { useState, useContext } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import ListItemButton from "@mui/material/ListItemButton";
import { usePathname } from "../../routes/hooks";
import { RouterLink } from "../../routes/components";
import Button from "@mui/material/Button";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import { NAV } from "./config-layout";
import { navConfig } from "./config-navigation";
import { service } from "./config-navigation";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ListItem,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { AuthContext } from "../../firebase/AuthContext";
import { useLocation } from "react-router-dom";
import Scrollbar from "../../components/scrollbar";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
export default function Nav() {
  const [selected, setSelected] = useState(true);
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleSelected = () => {
    setSelected((prev) => !prev);
  };

  return (
    <>
      {selected ? (
        <div>
          <Box
            sx={{
              flexShrink: { lg: 0 },
              width: { lg: NAV.WIDTH },
            }}
          >
            <Box
              sx={{
                height: 1,
                position: "fixed",
                width: NAV.WIDTH,
                borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
              }}
            >
              <IconButton
                onClick={toggleSelected}
                sx={{
                  minHeight: 40,
                  width: 40,
                  height: 40,
                  mt: 1,
                  ml: 1.5,
                  mb: 2,
                }}
              >
                <KeyboardArrowLeftRoundedIcon />
              </IconButton>
              <Box
                sx={{
                  mt: 0.2,
                  mb: 2,
                  mx: 2,
                  py: 1,
                  px: 2,
                  display: "flex",
                  borderRadius: 1.5,
                  alignItems: "center",
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                }}
              >
                <Box
                  sx={{
                    ml: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle2">{"Medblik"}</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {"Admin Portal"}
                  </Typography>
                </Box>
              </Box>
              <Scrollbar style={{ height: "390px", width: "100%" }}>
                <Accordion slotProps={{ heading: { component: 'h1' }
                 }}
                  sx={{
                    minHeight: '30px', // Adjust the overall minHeight
                    '&.MuiAccordion-root': { // Additional root adjustments if necessary
                        marginBottom: '8px', // Space between accordions
                    },
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                  }}
                >
                  <AccordionSummary 
                    sx={{ 
                      minHeight: '30px', // Adjust the height of the AccordionSummary
                      '& .MuiAccordionSummary-content': {
                          margin: 0, // Remove extra margin
                      },
                  }}
                  expandIcon={<ExpandMoreIcon />}>
                    <ListItem
                      sx={{
                        borderRadius: 0.75,
                        typography: "body2",
                        color: "text.secondary",
                        textTransform: "capitalize",
                        fontWeight: "fontWeightMedium",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{ width: 24, height: 24, mb: 0.5, mr: 2, ml: 1.5 }}
                      >
                        <MedicalServicesIcon />
                      </Box>
                      <Box component="span">Services </Box>
                    </ListItem>
                  </AccordionSummary>
                  <AccordionDetails >
                    <Stack component="nav" spacing={0.3}>
                      {service.map((item) => (
                        <NavItem
                          key={item.title}
                          selected={selected}
                          item={item}
                        />
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                <Stack component="nav" spacing={0.5} sx={{ px: 2, mt: 1 }}>
                  {navConfig.map((item) => (
                    <NavItem key={item.title} selected={selected} item={item} />
                  ))}
                </Stack>
              </Scrollbar>

              <Box sx={{ flexGrow: 1 }} />
              <Button
                variant="outlined"
                color="error"
                large
                sx={{ position: "absolute", left: 30, bottom: 40, right: 30 }}
                onClick={handleLogout}
              >
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                Logout
              </Button>
            </Box>
          </Box>
        </div>
      ) : (
        <Box
          sx={{
            flexShrink: { lg: 0 },
            width: { lg: NAV.MINWIDTH },
          }}
        >
          <Box
            sx={{
              height: 1,
              width: NAV.MINWIDTH,
              position: "fixed",

              borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          >
            <IconButton
              onClick={toggleSelected}
              spacing={0.5}
              sx={{
                minHeight: 40,
                width: 40,
                height: 40,
                mt: 1,
                ml: 1.5,
                mb: 2,
              }}
            >
              <KeyboardArrowRightRoundedIcon />
            </IconButton>
            <Stack component="nav" spacing={0.5}>
              {service.map((item) => (
                <NavItem item={item} />
              ))}
            </Stack>
            <Stack component="nav" spacing={0.5}>
              {navConfig.map((item) => (
                <NavItem item={item} />
              ))}
            </Stack>
            <IconButton
              onClick={handleLogout}
              sx={{
                position: "fixed",
                bottom: 25,
                left: 11,
                color: "error.main",
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

function NavItem({ item, selected }) {
  const pathname = usePathname();

  const isActive = (item) => {
    if (item.path === "/hospitals") {
      return (
        pathname === "/hospitals" ||
        pathname === "/hospitals/view-hospital" ||
        pathname === "/hospitals/add-hospital"
      );
    } else if (item.path === "/clinics") {
      return (
        pathname === "/clinics" ||
        pathname === "/clinics/view-clinic" ||
        pathname === "/clinics/add-clinic"
      );
    } else if (item.path === "/Pharmacies") {
      return (
        pathname === "/Pharmacies" ||
        pathname === "/Pharmacies/view-pharmacy" ||
        pathname === "/pharmacy/add-pharmacy"
      );
    } else if (item.path === "/labcenter") {
      return (
        pathname === "/labcenter" ||
        pathname === "/labcenter/view-labcenter" ||
        pathname === "/labcenter/add-labcenter"
      );
    } else if (item.path === "/ambulance") {
      return (
        pathname === "/ambulance" ||
        pathname === "/ambulance/view-ambulance" ||
        pathname === "/ambulance/add-ambulance"
      );
    } else if (item.path === "/extra") {
      return (
        pathname === "/extra" ||
        pathname === "/extra/view-extra" ||
        pathname === "/extra/add-extra"
      );
    }

    return item.path === pathname;
  };

  const active = isActive(item);

  return (
    <>
      {selected ? (
        <ListItemButton
          component={RouterLink}
          href={item.path}
          sx={{
            minHeight: 30,
            borderRadius: 0.75,
            typography: "body2",
            color: "text.secondary",
            textTransform: "capitalize",
            fontWeight: "fontWeightMedium",
            ...(active && {
              color: "primary.main",
              fontWeight: "fontWeightSemiBold",
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              "&:hover": {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
              },
            }),
          }}
        >
          <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
            {item.icon}
          </Box>
          <Box component="span">{item.title} </Box>
        </ListItemButton>
      ) : (
        <ListItemButton
          component={RouterLink}
          href={item.path}
          sx={{
            minHeight: 44,
            borderRadius: 0.75,
            typography: "body2",
            color: "text.secondary",
            textTransform: "capitalize",
            fontWeight: "fontWeightMedium",
            ...(active && {
              color: "primary.main",
              fontWeight: "fontWeightSemiBold",
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              "&:hover": {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
              },
            }),
          }}
        >
          <Box component="span" sx={{ width: 24, height: 24, ml: 0.4 }}>
            {item.icon}
          </Box>
        </ListItemButton>
      )}
    </>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};
