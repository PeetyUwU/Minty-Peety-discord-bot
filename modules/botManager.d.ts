import { Client } from "discord.js";
import EventEmitter from "events";

interface BotOptions {
    id?: number
    filePath?: string
    max?: number 
}

interface Events {
    DatabaseChange: "databaseChange"
    Add: "add"
}

export declare class Bot extends EventEmitter {
    static managerCount: number

    public constructor(name: string, discordClient: Client, opts?: BotOptions)

    public checkMaxNumber(): boolean
    public checkManagers(): void
    public fixManager(): void
    public watchDatabase(): void
    public updateManagerList(): this    
    public addManager(managerId: string): this
    public getManager(managerId: string): boolean
    public on<K extends keyof Events,>(event: Events[K], listener: (...args: object) => void) : void
}