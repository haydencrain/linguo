import { FrinkiacService, IFrinkiacService } from './FrinkiacService';

export function installFrinkiac(): { frinkiacService: IFrinkiacService } {
  const frinkiacService = new FrinkiacService();
  return { frinkiacService };
}
