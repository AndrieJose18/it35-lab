import { 
  IonButton,
  IonContent, 
  IonHeader, 
  IonIcon, 
  IonInput, 
  IonItem, 
  IonList, 
  IonPage, 
  IonText, 
  IonTitle, 
  IonToolbar, 
  useIonRouter, 
  IonCard, 
  IonCardContent
} from '@ionic/react';
import { mailOutline, lockClosed, eye, eyeOff } from 'ionicons/icons'; // Import eye icons
import { useState } from 'react';

const Login: React.FC = () => {
  const navigation = useIonRouter();
  
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State for validation
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Controls password visibility

  // Function to handle login
  const handleLogin = () => {
    if (!email || !password) {
      setErrorMessage('Email and password are required.');
      return;
    }

    setErrorMessage('');
    navigation.push('/it35-lab/app', 'root'); // Redirect to main app after login
  };

  return (
    <IonPage>
      <IonContent className="ion-padding ion-text-center" fullscreen>
        {/* App Branding */}
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <h1 style={{ color: '#BE1E2D', fontSize: '36px', fontWeight: 'bold' }}>StrawHats Registration</h1>
          <IonText color="medium">
            <p>Welcome aboard. Start your One Piece journey!</p>
          </IonText>
        </div>

        {/* Centered Login Card */}
        <IonCard style={{ maxWidth: '5000px', margin: 'auto', marginTop: '50px', padding: '50px' }}>
          <IonCardContent>
            <IonList>
              {/* Email Input */}
              <IonItem>
                <IonIcon slot="start" icon={mailOutline} />
                <IonInput 
                  label="Email" 
                  labelPlacement="stacked" 
                  type="email" 
                  placeholder="Enter your email"
                  value={email}
                  onIonInput={(e) => setEmail(e.detail.value!)}
                />
              </IonItem>

              {/* Password Input with Toggle */}
              <IonItem>
                <IonIcon slot="start" icon={lockClosed} />
                <IonInput
                  label="Password"
                  labelPlacement="stacked"
                  type={showPassword ? 'text' : 'password'} // Toggle between text and password
                  placeholder="Enter your password"
                  value={password}
                  onIonInput={(e) => setPassword(e.detail.value!)}
                />
                <IonIcon 
                  slot="end"
                  icon={showPassword ? eyeOff : eye} // Show eye icon when hidden, eye-off when visible
                  onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                  style={{ cursor: 'pointer', fontSize: '20px', color: '#666' }} // Styling
                />
              </IonItem>
            </IonList>

            {/* Error Message Display */}
            {errorMessage && <IonText color="danger"><p>{errorMessage}</p></IonText>}

            {/* Login Button */}
            <IonButton expand="full" onClick={handleLogin} style={{ backgroundColor: '#BE1E2D', color: '#fff', marginTop: '10px' }}>
              Log In
            </IonButton>

            {/* Forgot Password Link */}
            <IonText>
              <p style={{ marginTop: '10px' }}>
                <a href="#" style={{ color: '#BE1E2D', textDecoration: 'none' }}>Forgot password?</a>
              </p>
            </IonText>

            <hr style={{ margin: '15px 0', border: '0.5px solid #ccc' }} />

            {/* Sign Up Button */}
            <IonButton 
              expand="full" 
              fill="outline" 
              onClick={() => navigation.push('/Signup', 'forward')} 
              style={{ color: '#BE1E2D', borderColor: '#BE1E2D' }}
            >
              Don’t have an account? Sign Up
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Login;
