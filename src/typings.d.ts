export interface Connection {
    name: string;
    connection: import('ws').WebSocket;
    ip: string;
    messageListener: (data: ClientMessage) => void;
}

export interface Computer {
    name: string;
    connection: import('ws').WebSocket;
    ip: string;
    connected: boolean;
}

export interface ClientMessage {
    name?: string;
    ip?: string;
    matlabInfo?: string;
}

export interface ServerMessage {
    filename: string;
    text: string;
}