import { MercadoPagoConfig, Preference } from 'mercadopago';
import type {
  PreferenceRequest,
  PreferenceResponse,
} from 'mercadopago/dist/clients/preference/commonTypes';

export async function createMercadoPagoPreference(
  accessToken: string,
  body: PreferenceRequest,
): Promise<PreferenceResponse> {
  const client = new MercadoPagoConfig({ accessToken });
  const preference = new Preference(client);
  return preference.create({ body });
}
