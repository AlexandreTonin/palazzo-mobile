import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Properties from "./pages/app/properties/Properties";
import LikedProperties from "./pages/app/liked-properties/LikedProperties";
import Contact from "./pages/app/contact/Contact";
import "./globals.css";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import { Building, Heart, Phone } from "lucide-react";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/tab1">
            <Properties />
          </Route>
          <Route exact path="/tab2">
            <LikedProperties />
          </Route>
          <Route path="/tab3">
            <Contact />
          </Route>
          <Route exact path="/">
            <Redirect to="/tab1" />
          </Route>
        </IonRouterOutlet>

        <IonTabBar slot="bottom" className="tab-bar">
          <IonTabButton tab="tab1" href="/tab1" className="tab-bar-tab">
            <Building size={20} />
          </IonTabButton>
          <IonTabButton tab="tab2" href="/tab2" className="tab-bar-tab">
            <Heart size={20} />
          </IonTabButton>
          <IonTabButton tab="tab3" href="/tab3" className="tab-bar-tab">
            <Phone size={20} />
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
