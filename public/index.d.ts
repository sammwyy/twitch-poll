declare module "activity" {
    interface Activity {
        username: string;
        usernameColor?: string;
        feed: string;
        highlight?: string;
        highlightColor?: string;
    }
    export function addActivityItem(activity: Activity): void;
    export function clearActivity(): void;
}
declare module "constants" {
    export const DEBUG = false;
    export const VERSION = 1;
}
declare module "results" {
    type ChartJS = {
        data: ChartData;
        update: () => unknown;
    };
    type ChartDataSet = {
        label: string;
        data: number[];
        backgroundColor: string[];
        hoverOffset: number;
    };
    type ChartData = {
        labels: string[];
        datasets: ChartDataSet[];
    };
    export const COLORS: string[];
    const chart: ChartJS;
    export default chart;
}
declare module "settings" {
    export function initializeForm(options: string[], addListener?: boolean): void;
    export function showSettings(): void;
    export function hideSettings(): void;
    export function toggleSettings(): void;
}
declare module "ui" {
    export function toggleStart(): void;
    export function toggleStop(): void;
}
declare module "app" {
    type Json<K extends string | number | symbol, V> = {
        [key in K]: V[];
    };
    type Votes = Json<string, string>;
    type OptionData = {
        id: string;
        label: string;
        labelColor: string;
    };
    export interface AppSettings {
        votes: Votes;
        options: string[];
        username: string | null;
    }
    class App implements AppSettings {
        active: boolean;
        changed: boolean;
        votes: Votes;
        options: string[];
        username: string | null;
        constructor();
        getResults(): {
            id: string;
            value: number;
        }[];
        updateLabels(): void;
        updateValues(): void;
        reset(options?: string[], votes?: Votes, save?: boolean): void;
        start(): void;
        stop(): void;
        findOption(message: string): OptionData | null;
        hasVoted(username: string): boolean;
        addVote(option: OptionData, username: string, color: string): void;
        parseVote(message: string, username: string, color: string): void;
    }
    const app: App;
    export default app;
}
declare module "chat" {
    const chat: any;
    export default chat;
}
declare module "login" {
    export function recoverSession(): void;
}
declare module "persistent_data" {
    export function tryLoad<V>(key: string): V;
    export function save(key: string, value: unknown): void;
}
declare module "index" { }
