import { createTheme, responsiveFontSizes } from "@mui/material/styles";
declare module "@mui/material/styles" {
  interface Palette {
    backgroundPrimary: Palette["primary"];
    textPrimary: Palette["primary"];
    greyScale: Palette["primary"];
  }

  interface PaletteOptions {
    backgroundPrimary?: PaletteOptions["primary"];
    textPrimary?: PaletteOptions["primary"];
    greyScale?: PaletteOptions["primary"];
  }
  interface PaletteColor {
    darker?: string;
    lighter?: string;
    extraDarker?: string;
    extraLighter?: string;
    [key: string]: string | undefined;
  }

  interface SimplePaletteColorOptions {
    darker?: string;
    lighter?: string;
    extraDarker?: string;
    extraLighter?: string;
  }

  interface TypographyVariants {
    p: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    p?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    p: true;
  }
}

let theme = createTheme({
  palette: {
    primary: {
      main: "#F97D09", //green
      light: "#FFF2E7",
      lighter: "#FFFCF9",
    },
    // secondary: {
    //   main: "#17CF9D", //green
    //   light: "#47E8BD",
    //   lighter: "#BDFFED",
    // },

    backgroundPrimary: {
      main: "#fff", //white
    },

    textPrimary: {
      main: "#232323", //black
    },

    greyScale: {
      main: "#8A8A8A",
      dark: "#808080",
      darker: "#D5D6D7",
      light: "#EBEBEB",
      lighter: "#F4F4F5",
    },
  },

  typography: {
    fontSize: 12,
    fontFamily: ["Inter", "sans-serif"].join(","),
    h1: {
      fontWeight: 500,
      fontSize: 22,
    },
    h2: {
      fontWeight: 600,
      fontSize: 20,
    },
    h3: {
      fontWeight: 600,
      fontSize: 15,
    },
    h4: { fontWeight: 600, fontSize: 14 },
    h5: {
      fontWeight: 400,
      fontSize: 14,
    },
    h6: {
      fontWeight: 500,
      fontSize: 12,
    },
    p: {
      fontWeight: 400,
      fontSize: 12,
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
