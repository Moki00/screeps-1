import Logger from "./logger";

const SCREEPS_CPU_BUCKET_MAX = 10000;

export default function updateGeneratePixels(): void {
  const shouldGeneratePixel =
    Game.cpu.generatePixel &&
    Game.cpu.bucket > SCREEPS_CPU_BUCKET_MAX - Game.cpu.limit;
  if (shouldGeneratePixel) {
    switch (Game.cpu.generatePixel()) {
      case OK:
        Logger.info(`Pixel has been generated.`);
        break;
    }
  }
}
