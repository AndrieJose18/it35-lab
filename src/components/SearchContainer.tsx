import React, { useState } from 'react';
import { IonItem, IonList, IonSearchbar, IonAvatar, IonLabel } from '@ionic/react';
import logo from '../assets/onepiecelogo.jpg'; // 🏴‍☠️ Straw Hat Logo

function SearchContainer() {
  const data = [
    // Straw Hat Pirates
    'Monkey D. Luffy',
    'Roronoa Zoro',
    'Nami',
    'Usopp',
    'Sanji',
    'Tony Tony Chopper',
    'Nico Robin',
    'Franky',
    'Brook',
    'Jinbe',

    // Whitebeard Pirates
    'Edward Newgate',
    'Marco the Phoenix',
    'Jozu',
    'Vista',
    'Ace',
    'Izo',
    'Thatch',
    'Blamenco',
    'Rakuyo',
    'Namur',
    'Fossa',
    'Atmos',

    // Blackbeard Pirates
    'Marshall D. Teach',
    'Jesus Burgess',
    'Shiryu',
    'Van Augur',
    'Laffitte',
    'Doc Q',
    'Stronger',
    'Catarina Devon',
    'Sanjuan Wolf',
    'Vasco Shot',
    'Avalo Pizarro',

    // Sun Pirates
    'Fisher Tiger',
    'Aladine',
    'Arlong',
    'Hatchan',
    'Chew',
    'Kuroobi',

    // Red-Haired Pirates
    'Shanks',
    'Benn Beckman',
    'Lucky Roux',
    'Yasopp',
    'Limejuice',
    'Bonk Punch',
    'Monster',
    'Hongo',
    'Gab',
    'Howling Gab',
    'Rockstar',

    // Big Mom Pirates
    'Charlotte Linlin',
    'Charlotte Katakuri',
    'Charlotte Smoothie',
    'Charlotte Cracker',
    'Charlotte Perospero',
    'Charlotte Oven',
    'Charlotte Daifuku',
    'Charlotte Brûlée',
    'Charlotte Mont-d\'Or',
    'Charlotte Snack',
    'Charlotte Compote',
    'Zeus',
    'Prometheus',
    'Napoleon',

    // Beasts Pirates
    'Kaido',
    'King',
    'Queen',
    'Jack',
    'Who’s-Who',
    'Sasaki',
    'Black Maria',
    'Page One',
    'Ulti',
    'X Drake',

    // Roger Pirates
    'Gol D. Roger',
    'Silvers Rayleigh',
    'Scopper Gaban',
    'Kozuki Oden',
    'Crocus',
    'Shanks (Young)',
    'Buggy (Young)',

    // Kuja Pirates
    'Boa Hancock',
    'Boa Sandersonia',
    'Boa Marigold',

    // Arlong Pirates
    'Hatchan',
    'Kuroobi',
    'Chew',

    // Others
    'Buggy the Clown',
    'Donquixote Doflamingo',
    'Gecko Moria',
    'Eustass Kid',
    'Trafalgar D. Water Law',
    'Basil Hawkins',
    'Scratchmen Apoo',
    'Capone Bege',
    'Jewelry Bonney',
    'Urouge',
    'Cavendish',
    'Bartolomeo',
    'Bellamy',
    'Foxy',
    'Alvida',
    'Wapol',
    'Crocodile',
    'Douglas Bullet',
    'Bepo',
    'Tama',

    // Ships
    'Going Merry',
    'Thousand Sunny',
    'Red Force',
    'Oro Jackson',
    'Polar Tang'
  ];

  const [results, setResults] = useState([...data]);

  const handleInput = (event: Event) => {
    let query = '';
    const target = event.target as HTMLIonSearchbarElement;
    if (target) query = target.value!.toLowerCase();

    setResults(data.filter((d) => d.toLowerCase().includes(query)));
  };

  return (
    <>
      <IonSearchbar
        debounce={100}
        placeholder="Search One Piece Pirates or Ships..."
        onIonInput={(event) => handleInput(event)}
        style={{
          '--background': '#fbeec1',
          '--color': '#000',
          '--placeholder-color': '#6b4c2f',
          fontWeight: 'bold',
        }}
      ></IonSearchbar>

      <IonList>
        {results.map((result, index) => (
          <IonItem key={index} style={{ background: 'rgba(255, 248, 220, 0.85)' }}>
            <IonAvatar slot="start">
              <img src={logo} alt="One Piece" />
            </IonAvatar>
            <IonLabel>{result}</IonLabel>
          </IonItem>
        ))}
      </IonList>
    </>
  );
}

export default SearchContainer;
