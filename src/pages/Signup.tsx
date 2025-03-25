import { 
    IonButton,
    IonContent, 
    IonHeader, 
    IonInput, 
    IonInputPasswordToggle, 
    IonItem, 
    IonList, 
    IonPage, 
    IonTitle, 
    IonToolbar,
    IonText,
    IonAlert,
    useIonRouter
} from '@ionic/react';
import { useState } from 'react';

const Signup: React.FC = () => {
    const navigation = useIonRouter();

    // State to manage form inputs
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // State for error messages
    const [error, setError] = useState('');
    
    // State for success alert
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    // Function to handle form submission
    const handleRegister = () => {
        if (!firstName || !lastName || !email || !password) {
            setError('All fields are required.');
            return;
        }
        
        setError(''); // Clear errors if validation passes
        setShowSuccessAlert(true);
    };

    // Function to handle success alert dismissal and redirect to login page
    const handleSuccessDismiss = () => {
        setShowSuccessAlert(false);
        navigation.push('/it35-lab', 'root'); // Redirect to home page
    };

    return (
        <IonPage>
            {/* Header Section */}
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Signup</IonTitle>
                </IonToolbar>
            </IonHeader>

            {/* Registration Form */}
            <IonContent className="ion-padding">
                <IonList>
                    {/* First Name */}
                    <IonItem>
                        <IonInput 
                            label="First Name" 
                            labelPlacement="floating"
                            type="text" 
                            placeholder="Enter your first name" 
                            value={firstName} 
                            onIonInput={(e) => setFirstName(e.detail.value!)}
                        />
                    </IonItem>

                    {/* Last Name */}
                    <IonItem>
                        <IonInput 
                            label="Last Name" 
                            labelPlacement="floating"
                            type="text" 
                            placeholder="Enter your last name" 
                            value={lastName} 
                            onIonInput={(e) => setLastName(e.detail.value!)}
                        />
                    </IonItem>

                    {/* Email */}
                    <IonItem>
                        <IonInput 
                            label="Email" 
                            labelPlacement="floating"
                            type="email" 
                            placeholder="Enter your email" 
                            value={email} 
                            onIonInput={(e) => setEmail(e.detail.value!)}
                        />
                    </IonItem>

                    {/* Password with Eye Toggle */}
                    <IonItem>
                        <IonInput 
                            label="Password" 
                            labelPlacement="floating"
                            type="password" 
                            placeholder="Enter your password" 
                            value={password} 
                            onIonInput={(e) => setPassword(e.detail.value!)}
                        >
                            <IonInputPasswordToggle slot="end" />
                        </IonInput>
                    </IonItem>
                </IonList>

                {/* Error Message Display */}
                {error && <IonText color="danger"><p>{error}</p></IonText>}

                {/* Simplified Register Button */}
                <IonButton 
                    expand="full" 
                    onClick={handleRegister}
                    style={{
                        backgroundColor: '#4A90E2', 
                        color: '#fff', 
                        borderRadius: '10px', 
                        fontSize: '16px', 
                        fontWeight: 'bold'
                    }}
                >
                    Register
                </IonButton>

                {/* Simplified Login Button */}
                <IonButton 
                    expand="full" 
                    fill="outline" 
                    onClick={() => navigation.push('/login', 'back')}
                    style={{
                        borderRadius: '10px', 
                        fontSize: '16px', 
                        fontWeight: 'bold', 
                        color: '#4A90E2', 
                        borderColor: '#4A90E2'
                    }}
                >
                    Login Instead
                </IonButton>

                {/* Success Alert */}
                <IonAlert
                    isOpen={showSuccessAlert}
                    onDidDismiss={handleSuccessDismiss}
                    header="Congrats!!"
                    message="You're one of the Strawhats now YOHOHOHO!!!"
                    buttons={["OK"]}
                />
            </IonContent>
        </IonPage>
    );
};

export default Signup;
