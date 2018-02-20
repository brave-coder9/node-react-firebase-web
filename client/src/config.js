export default {
  apiUrl: 'http://localhost:5000/api/'
};
const siteConfig = {
  siteName: 'FastWind',
  siteIcon: 'ion-flash',
  defaultAvatar: '/images/default-avatar.jpg',
  footerText: 'FastWind ©2017'
};

const themeConfig = {
  topbar: 'themedefault',
  sidebar: 'themedefault',
  layout: 'themedefault'
};
const language = 'english';

const firebaseConfig = {
  apiKey: "AIzaSyDUUrs25QIEDBl4_csOi5bV6lm7RGsEgAk",
  authDomain: "fastwind-fe4c3.firebaseapp.com",
  databaseURL: "https://fastwind-fe4c3.firebaseio.com",
  projectId: "fastwind-fe4c3",
  storageBucket: "gs://fastwind-fe4c3.appspot.com",
  messagingSenderId: "20024156577"
};
const firebaseDatabase = {
  dbname: "fastwind-fe4c3",
  user: {
    collection: "Users",
    prefix: "-user"
  },
  team: {
    collection: "Teams",
    prefix: "-team"
  },
  defaultPassword: "123456",
  subscription: {
    collection: "Subscriptions",
    prefix: "-subscription"
  },
  chat: {
    collection: "HistoryMessages"
  }
};
const firebaseStorage = {
  dirname: "avatars"
};

const pagingConfig = {
  "pageSize": 10,
  "finite": true,
  "retainLastPage": false
};

// no used at now
const Auth0Config = {
  domain: '',
  clientID: '', //
  options: {
    auth: {
      autoParseHash: true,
      redirect: false
    },
    languageDictionary: {
      title: 'FastWind',
      emailInputPlaceholder: 'demo@gmail.com',
      passwordInputPlaceholder: 'demodemo'
    },
    icon: '',
    theme: {
      labeledSubmitButton: true,
      logo: 'https://s3.amazonaws.com/redqteam.com/logo/isomorphic.png',
      primaryColor: '#E14615',
      authButtons: {
        connectionName: {
          displayName: 'Log In',
          primaryColor: '#b7b7b7',
          foregroundColor: '#000000',
          icon: undefined
        }
      }
    }
  }
};

const subscriptionsConfig = {
  reminderDays: 5,
  categories: [
    {
      type: "trial",
      title: "Trial",
      image: "/images/subscription-trial.png",
      monthly: 0,
      yearly: 0,
      description: "10 days free",
    },
    {
      type: "basic",
      title: "Basic",
      image: "/images/subscription-basic.png",
      monthly: 29.95,
      yearly: 359.4,
      description: "plus tax",
    },
    {
      type: "pro",
      title: "Pro",
      image: "/images/subscription-pro.png",
      monthly: 39.95,
      yearly: 479.4,
      description: "plus tax",
    },
    {
      type: "enterprise",
      title: "Enterprise",
      image: "/images/subscription-enterprise.png",
      monthly: 49.95,
      yearly: 599.4,
      description: "plus tax",
    }
  ]
};

const paypalConfig = {
  client: {
    sandbox:    'IDWF4NMLMVRDL9E',
    production: 'YOUR-PRODUCTION-APP-ID',
  },
  env: 'sandbox',
  currency: 'USD'
}

const DATEformat = 'MM/DD/YYYY';
const TIMEformat = 'hh:mm A';
const DATETIMEformat = DATEformat+" "+TIMEformat;

export {
  siteConfig,
  themeConfig,
  language,
  firebaseConfig,
  firebaseDatabase,
  firebaseStorage,
  pagingConfig,
  Auth0Config,
  subscriptionsConfig,
  paypalConfig,

  DATEformat,
  TIMEformat,
  DATETIMEformat,
};
