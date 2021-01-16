export const ERRORS = {
    CONNECTION_ISSUE: 'Could not fetch data, check your network',
    GRAPH_NO_DATA: 'No data available'
}

export const MESSAGES = {

};

export const LABELS = {
    DEPARTURE_DATES: 'Departure dates:',
    RETURN_DATES: 'Return dates:',
    STATUS: 'Status:',
    ALERT: 'Alert:',
    TRIGGER_PRICE: 'Trigger price:'
};

export const TRACKER_STATUS = {
    INACTIVE: 'INACTIVE',
    INIT: 'INIT',
    LOADING: 'LOADING',
    FAIL: 'FAIL',
    COMPLETE: 'COMPLETE'
}

export const NB_TRACKERS = 6;
export const EARTH_RADIUS = 6371; // Radius of the earth in km
export const AIRPORT_TYPES = ['medium_airport', 'large_airport', 'multi_airport'];

export const TERMS_TYPES = {
    shortTerm:  'short_term',
    mediumTerm: 'medium_term',
    longTerm:   'long_term'
}

export const GRAPH_STATS_AVAILABLE = {
    MIN_PRICES: { name: 'Min prices', field: 'minPrice' },
    MAX_PRICES: { name: 'Max prices', field: 'maxPrice' },
    AVERAGE_PRICES: { name: 'Average prices', field: 'averagePrice' },
    MEDIAN_PRICES: { name: 'Median prices', field: 'medianPrice' },
    COMBINED: { name: 'Combined' }
};

//export const GRAPH_COLORS = ['rgba(154, 62, 235, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)', '#4bc0c0', 'rgb(255,205, 86)', '#9496F7'];
//export const GRAPH_COLORS = ['#22226B', '#4B4BEB', '#4F4FF7', '#4343D1', '#8D8EEB', '#9496F7'];
//export const GRAPH_COLORS = [/*DARK BLUE*/'#22226B', /*GREEN*/'#2E765E', /*PINK*/'#a92742', /*PURPLE*/'#4b0bb1', /*YELLOW*/ '#F5B430',/*LIGHT GRAY*/'#9496F7'];
export const GRAPH_COLORS = ['#2F0685', '#1C4FDB', '#016442', '#575E99', '#92DF23', '#9496F7']
export const NICE_NAMES = {
    'short_term':   'Short term',
    'medium_term':  'Medium term',
    'long_term':    'Long term'
}

export const DEFAULT_GRAPH_STAT = 'Min prices';