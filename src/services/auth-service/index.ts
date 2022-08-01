import * as Web3Token from "web3-token";

class AuthService {
	async verify(token: string): Promise<string | undefined> {
		try {
			const { address } = await Web3Token.verify(token);
			return address;
		} catch {
			return undefined;
		}
	}
}

const authService = new AuthService();

export default authService;
