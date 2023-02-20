

export interface Events {
   add: [message: Test]
   remove: [user: object]
}

interface Test {
   test1: "hi"
   test2: "test"
}


type EventMap = {
   add: [Test],
   remove: [object]
}

type EventFunction<E extends keyof EventMap> = (...args: EventMap[E]) => void;

export declare class MyClass {
   public static setProperty<C extends keyof EventMap>(
      event: C,
      listener: EventFunction<E>
      ): void;
      
   // public static setProperty(key: Test, value: number): void;
   // public static setProperty(key: KeyType, value: (string | number)): void {}
}


// declare module "node:events" {
//    class EventEmitter {
//       public static on<E extends EventEmitter, K extends keyof ClientEvents>(eventEmitter: E, eventName: K): void
//    }
// }

// function addData<C>(data1 : string, data2 : string) : string;
  
// function addData(data1 : number, data2 : number): number;
  
// function addData(data1 : any, data2 : any){
//     return data1+ data2;
// }


