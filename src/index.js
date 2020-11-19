
const appElement = document.querySelector("#app");


const app = () => {
  let mounted = false;
  let audioInstance = undefined;
  let progressBarInterval = undefined;

  let state = {
    playlist: [
      {
        name: "t-Rex",
        url:
          "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3"
      },
      {
        name: "cricket",
        url:
          "https://actions.google.com/sounds/v1/animals/afternoon_crickets_long.ogg"
      },
      {
        name: "dog",
        url: "https://actions.google.com/sounds/v1/animals/dog_growling.ogg"
      },
      {
        name: "cicada",
        url: "https://actions.google.com/sounds/v1/animals/cicada_chirp.ogg"
      },
      {
        name: "woodpecker",
        url:
          "https://actions.google.com/sounds/v1/animals/woodpecker_pecking_fast.ogg"
      }
    ],
    play: false,
    pause: false,
    stop: false,
    currentSong: 0,
    percentage: 0
  };

  const init = () => {
    render();
  };

  const setState = (newState) => {
    state = { ...state, ...newState };

    render();
  };

  const didUpdate = () => {
    if (audioInstance.src !== state.playlist[state.currentSong].url) {
      audioInstance.setAttribute("src", state.playlist[state.currentSong].url);
    }

    if (state.play) {
      audioInstance.play();
    }

    if (state.pause) {
      audioInstance.pause();
    }

    if (state.stop) {
      audioInstance.pause();
      audioInstance.currentTime = 0;
    }

    styleProgressBarLine();
  };

  const didMount = () => {
    createAudio();
  };

  const createAudio = () => {
    audioInstance = new Audio();
    audioInstance.setAttribute("src", state.playlist[state.currentSong].url);
    audioInstance.addEventListener("ended", handleAudioEnded);
  };

  const render = () => {
    appElement.innerHTML = "";

    const container = document.createElement("div");
    container.classList.add("container");
    const playlisContainer = createPlaylist();

    const buttonsContainer = createButtonsContainer();
    const progressBar = createProgressBar();

    const elements = [buttonsContainer, playlisContainer, progressBar];

    elements.forEach((element) => {
      container.appendChild(element);
    });

    appElement.appendChild(container);

    if (mounted) {
      didUpdate();
    }

    if (!mounted) {
      mounted = true;
      didMount();
    }
  };

  const styleProgressBarLine = () => {
    const progressBarLine = document.querySelector(".progress-bar__line");
    const percentage = !state.audioEnded
      ? (audioInstance.currentTime / audioInstance.duration) * 100
      : 0;

    setStyles(progressBarLine, {
      width: `${percentage}%`
    });
  };

  // Events
  const handleProgressBarIntervalChange = () => {
    styleProgressBarLine();
  };

  const handlePreviousButtonClick = () => {
    const isFirst = state.currentSong === 0;
    const index = !isFirst ? state.currentSong - 1 : state.playlist.length - 1;

    setState({
      currentSong: index
    });
  };

  const startProgressBarInterval = () => {
    progressBarInterval = window.setInterval(
      handleProgressBarIntervalChange,
      200
    );
  };

  const handlePlayButtonClick = () => {
    startProgressBarInterval();

    setState({
      play: true,
      pause: false,
      stop: false,
      audioEnded: false
    });
  };

  const handlePauseButtonClick = () => {
    window.clearInterval(progressBarInterval);

    setState({
      pause: true,
      play: false,
      stop: false
    });
  };

  const handleStopButtonClick = () => {
    setState({
      pause: false,
      play: false,
      stop: true
    });
  };

  const handleNextButtonClick = () => {
    const isLast = state.playlist.length - 1 === state.currentSong;
    const index = !isLast ? state.currentSong + 1 : 0;

    setState({
      currentSong: index
    });
  };

  const handlePlaylistItemClick = (index) => {
    startProgressBarInterval();

    setState({
      currentSong: index,
      play: true
    });
  };

  const handleAudioEnded = () => {
    window.clearInterval(progressBarInterval);

    setState({
      play: false,
      pause: false,
      stop: false,
      audioEnded: true
    });
  };

  // DOM elements
  const createButtonsContainer = () => {
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("button-container");

    const previousButton = createPreviousButton();
    const playButton = createPlayButton();
    const pauseButton = createPauseButton();
    const nextButton = createNextButton();
    const StopButton = createStopButton();

    const buttons = [
      previousButton,
      playButton,
      pauseButton,
      StopButton,
      nextButton
    ];

    buttons.forEach((button) => {
      buttonsContainer.appendChild(button);
    });

    return buttonsContainer;
  };

  const createButton = (text, event, active) => {
    const button = document.createElement("button");
    button.classList.add("button");
    button.innerText = text;

    if (active) {
      button.classList.add("button--active");
    }

    button.addEventListener("click", event);
    return button;
  };

  const createPreviousButton = () => {
    return createButton("back", handlePreviousButtonClick);
  };

  const createPlayButton = () => {
    const isPlaying = state.play === true;

    return createButton("play", handlePlayButtonClick, isPlaying);
  };

  const createPauseButton = () => {
    const isPaused = state.pause === true;

    return createButton("pause", handlePauseButtonClick, isPaused);
  };

  const createNextButton = () => {
    return createButton("next", handleNextButtonClick);
  };

  const createStopButton = () => {
    const isStoped = state.stop === true;
    return createButton("stop", handleStopButtonClick, isStoped);
  };

  const createPlaylist = () => {
    const playlistContainer = document.createElement("div");
    playlistContainer.classList.add("playlist-container");
    state.playlist.forEach((item, index) => {
      const playlistItem = document.createElement("div");
      playlistItem.classList.add("playlist__item");

      if (state.currentSong === index) {
        playlistItem.classList.add("playlist__item--active");
      }

      playlistItem.innerText = `${item.name}`;
      playlistContainer.appendChild(playlistItem);
      playlistItem.addEventListener("click", () => {
        handlePlaylistItemClick(index);
      });
    });
    return playlistContainer;
  };

  const setStyles = (element, styleObject) => {
    Object.entries(styleObject).forEach(([key, value]) => {
      element.style[key] = value;
    });
  };

  const createProgressBar = () => {
    const progressBarParent = document.createElement("div");
    progressBarParent.classList.add("progress-bar__parent");
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");

    const progressBarLine = document.createElement("div");

    progressBarLine.classList.add("progress-bar__line");

    progressBarLine.addEventListener("durationchange", handlePlayButtonClick);
    progressBar.appendChild(progressBarLine);
    progressBarParent.appendChild(progressBar);

    return progressBarParent;
  };

  init();
};

app();
