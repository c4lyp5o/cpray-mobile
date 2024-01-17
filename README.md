# NNWS - No Nonsense Waktu Solat

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is a React Native application specifically designed to provide accurate prayer times for Muslims residing in Malaysia. The application is built with a user-friendly interface and aims to help users observe their prayers punctually.

The application uses a background fetch mechanism to regularly update prayer times based on the user's location. This ensures that the prayer times displayed are always accurate and up-to-date, accommodating for slight variations in prayer times across different geographical locations.

One of the key features of this application is the notification system. The application sends out timely notifications to remind users of each prayer time. These reminders help users to observe their prayers on time and can be customized according to user preferences.

The application is designed with simplicity and ease of use in mind, making it suitable for users of all ages. It is a handy tool for Muslims in Malaysia to observe their daily prayers and stay connected with their faith.

## Project Structure

- `App.js`: The entry point of the application.
- `assets/`: Contains static files like images and fonts.
- `components/`: Contains reusable components like `Drawercontent.js`, `Error.js`, `Fetch.js`, `Intro.js`, `Loading.js`, `Location.js`, `Notifications.js`, `Prayertimes.js`, `Zonepicker.js`.
- `lib/`: Contains helper functions and context providers like `Context.js`, `Helper.js`, `Player.js`, `Profile.js`.
- `modules/`: Contains modules for fetching data, handling location, and managing notifications.
- `pages/`: Contains the main pages of the application like `About.js`, `Dev.js`, `Home.js`, `Settings.js`.

## Installation

## First, clone the repository:

```sh
git clone <repository-url>
```

Then, navigate to the project directory and install the dependencies:

```sh
cd <project-name>
yarn install
```

## Running the Application

To start the application, run:

```sh
yarn start
```

This will start the application in development mode. Open the Expo client on your device and scan the QR code printed by yarn start to open the application.

## Contributing

Contributions are welcome! Please read the contributing guidelines before getting started.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
