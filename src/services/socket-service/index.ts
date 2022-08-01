import { Server } from "http";
import { Server as SocketServer } from "socket.io";
import { LinkContentResult } from "../../models/entity";
import authService from "../auth-service";
import redisService from "../redis-service";

class SocketService {
	private io?: SocketServer;

	public init(server: Server) {
		this.io = new SocketServer(server, {
			cors: {
				origin: "http://localhost:3000",
				methods: ["GET", "POST"],
			},
		});

		this.io.use((socket, next) => {
			const err = new Error("Authentication error");

			try {
				const token = socket.handshake.headers.authorization?.split(" ")[1];

				if (!token) {
					socket.disconnect();
					next(err);
				}

				authService.verify(token!).then(async (address) => {
					if (!address) {
						socket.disconnect();
						next(err);
					}
					await redisService.setSocket(token!, socket.id);
					(socket as any).token = token;
					(socket as any).address = address;
					next();
				}).catch(() => {
					socket.disconnect();
					next(err);
				});
			} catch {
				socket.disconnect();
				next(err);
			}
		});

		this.io.on("connect", (socket) => {
			socket.on("disconnect", async () => {
				try {
					await redisService.deleteSocket((socket as any).token);
				} catch (err) {
					console.log(err);
				}
			});
		});
	}

	async sendSyncMessage(token: string, data: LinkContentResult): Promise<boolean> {
		try {
			const socketId = await redisService.getSocketId(token);
			if (socketId) {
				this.io!.to(socketId).emit("contentSync", data);
				return true;
			}
			return false;
		} catch (err) {
			console.log(err);
			return false;
		}
	}
}

const socketService = new SocketService();

export default socketService;
