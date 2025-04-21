import {
    IonAlert,
    IonButton,
    IonContent, 
    IonHeader, 
    IonIcon, 
    IonItem, 
    IonMenu, 
    IonMenuButton, 
    IonMenuToggle, 
    IonPage, 
    IonRouterOutlet, 
    IonSplitPane, 
    IonTitle, 
    IonToast, 
    IonToolbar, 
    useIonRouter
  } from '@ionic/react';
  import { homeOutline, logOutOutline, rocketOutline, settingsOutline } from 'ionicons/icons';
  import { Redirect, Route } from 'react-router';
  import { supabase } from '../utils/supabaseClient';
  import { useState } from 'react';
  import Home from './Home';  // Ensure you import the Home component
  import About from './About';  // Import About component
  import Details from './Details';  // Import Details component
  import EditProfile from './EditProfile';  // Import EditProfile component
  
  const Menu: React.FC = () => {
    const navigation = useIonRouter();
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
  
    const path = [
      { name: 'Home', url: '/it35-lab/app/home', icon: homeOutline },
      { name: 'About', url: '/it35-lab/app/about', icon: rocketOutline },
      { name: 'Profile', url: '/it35-lab/app/profile', icon: settingsOutline }
    ];
  
    const handleLogout = async () => {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setShowToast(true);
        setTimeout(() => {
          navigation.push('/it35-lab', 'back', 'replace');  // Navigates back to the login page
        }, 300);
      } else {
        setErrorMessage(error.message);
        setShowAlert(true);
      }
    };
  
    return (
      <IonPage>
        <IonSplitPane contentId="main">
          {/* Sidebar menu */}
          <IonMenu contentId="main">
            <IonHeader>
              <IonToolbar>
                <IonTitle>Menu</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              {path.map((item, index) => (
                <IonMenuToggle key={index}>
                  <IonItem routerLink={item.url} routerDirection="forward">
                    <IonIcon icon={item.icon} slot="start" />
                    {item.name}
                  </IonItem>
                </IonMenuToggle>
              ))}
  
              {/* Logout Button */}
              <IonButton expand="full" onClick={handleLogout}>
                <IonIcon icon={logOutOutline} slot="start" />
                Logout
              </IonButton>
            </IonContent>
          </IonMenu>
  
          {/* Content area */}
          <IonRouterOutlet id="main">
            <Route exact path="/it35-lab/app/home" component={Home} />
            <Route exact path="/it35-lab/app/home/details" component={Details} />
            <Route exact path="/it35-lab/app/about" component={About} />
            <Route exact path="/it35-lab/app/profile" component={EditProfile} />
  
            <Route exact path="/it35-lab/app">
              <Redirect to="/it35-lab/app/home" />
            </Route>
          </IonRouterOutlet>
  
          {/* IonAlert for displaying logout errors */}
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header="Logout Failed"
            message={errorMessage}
            buttons={['OK']}
          />
  
          {/* IonToast for success message */}
          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message="Logout Successful"
            duration={1500}
            position="top"
            color="primary"
          />
        </IonSplitPane>
      </IonPage>
    );
  };
  
  export default Menu;
  