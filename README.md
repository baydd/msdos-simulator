# MS-DOS 6.22 Simulator

A nostalgic MS-DOS 6.22 operating system simulator that runs entirely in your web browser. Experience the authentic DOS computing environment of the early 1990s with classic games, commands, and a retro CRT monitor aesthetic.

## 🎮 Features

### Classic DOS Games
- **DOOM** - The legendary first-person shooter
- **Prince of Persia** - Platform adventure game
- **Pac-Man** - Classic arcade maze game
- **Snake** - Simple but addictive snake game
- **Tetris** - The famous falling blocks puzzle

### Authentic DOS Experience
- **Boot Sequence** - Realistic BIOS and DOS startup
- **Command Line Interface** - Full DOS command support
- **File System** - Navigate directories and files
- **CRT Monitor Effect** - Authentic tube monitor simulation
- **Sound Effects** - PC Speaker beeps and system sounds
- **Web Browser** - Browse real websites from within DOS

### Supported DOS Commands
```
DIR     - List directory contents
CD      - Change directory
TYPE    - Display file contents
CLS     - Clear screen
HELP    - Show available commands
VER     - Display DOS version
DATE    - Show/set date
TIME    - Show/set time
ECHO    - Display text
MEM     - Show memory usage
FORMAT  - Format disk (safe simulation)
WIN     - Start Windows (joke command)
```

### Easter Eggs & Fun Commands
- `FORMAT C:` - Harmless format warning
- `DELTREE C:\` - Safe delete tree simulation
- `WIN` - Windows 3.1 startup joke

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/baydd/msdos-simulator.git
   cd msdos-simulator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` and enjoy the nostalgic DOS experience!

## 🎯 How to Play Games

1. **Navigate to Games Directory**
   ```
   CD GAMES
   DIR
   ```

2. **Launch DOOM**
   ```
   CD DOOM
   DOOM.EXE
   ```

3. **Play Arcade Games**
   ```
   CD GAMES\ARCADE
   PACMAN.EXE
   SNAKE.EXE
   TETRIS.EXE
   ```

4. **Run Prince of Persia**
   ```
   CD GAMES\PRINCE
   PRINCE.EXE
   ```

## 🌐 Web Browser

Access the built-in web browser by typing:
```
BROWSE
```

The browser allows you to visit real websites while maintaining the retro DOS aesthetic!

## 🛠️ Technical Details

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Audio**: Web Audio API for authentic PC Speaker sounds

## 🎨 Features

- **Authentic CRT Monitor**: Curved screen with scanlines and glow effects
- **Realistic Boot Sequence**: BIOS messages and DOS startup
- **Sound Effects**: PC Speaker beeps and mechanical keyboard sounds
- **File System**: Simulated DOS directory structure
- **Game Library**: Collection of classic DOS games
- **Web Integration**: Browse real websites from within DOS

## 📱 Browser Compatibility

- ✅ Chrome/Chromium (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the golden age of DOS computing (1990-1995)
- Classic games recreated for educational and nostalgic purposes
- Built with modern web technologies for maximum compatibility

## 👨‍💻 Developer

**Dursun Durmuş**
- GitHub: [@baydd](https://github.com/baydd)
- Created: 2025

---

*Experience the nostalgia of 1990s computing right in your modern web browser!*