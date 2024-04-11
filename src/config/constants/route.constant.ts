type routePathsType={
    HOME:string,
    EXPLORE:string,
    PASSWORD_RESET:string,
    CREATE_PIN: string,
    ABOUT: string,
    WATCH: string,
    USER: string,
    PIN: string,
    BOARD:string,
    ALL_PINS:string
}


const routePaths:routePathsType={
    HOME:"/",
    EXPLORE:"/explore",
    PASSWORD_RESET:"/password-reset",
    CREATE_PIN:'/create-pin',
    ABOUT: '/about',
    WATCH:'/watch',
    USER:"/:username",
    PIN: "/pins/:id",
    BOARD:"/:username/:boardName",
    ALL_PINS:"/:username/pins"
}

export {routePaths}