import { Howl } from 'howler';

export const sounds = {
  ambience: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'], // Placeholder stadium ambience
    loop: true,
    volume: 0.3,
  }),
  click: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'], // Placeholder click
    volume: 0.5,
  }),
  unlock: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3'], // Placeholder unlock
    volume: 0.6,
  }),
  transition: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3'], // Placeholder transition
    volume: 0.4,
  }),
};

export const playSound = (name: keyof typeof sounds) => {
  sounds[name].play();
};
