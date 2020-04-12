import { FrinkiacService } from './FrinkiacService';

export function installFrinkiacService(): { frinkiacService: FrinkiacService } {
  const frinkiacService = new FrinkiacService();
  return { frinkiacService };
}
