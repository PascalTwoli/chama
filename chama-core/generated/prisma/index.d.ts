
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Chama
 * 
 */
export type Chama = $Result.DefaultSelection<Prisma.$ChamaPayload>
/**
 * Model Membership
 * 
 */
export type Membership = $Result.DefaultSelection<Prisma.$MembershipPayload>
/**
 * Model Invite
 * 
 */
export type Invite = $Result.DefaultSelection<Prisma.$InvitePayload>
/**
 * Model Contribution
 * 
 */
export type Contribution = $Result.DefaultSelection<Prisma.$ContributionPayload>
/**
 * Model Payment
 * 
 */
export type Payment = $Result.DefaultSelection<Prisma.$PaymentPayload>
/**
 * Model NotificationType
 * 
 */
export type NotificationType = $Result.DefaultSelection<Prisma.$NotificationTypePayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>
/**
 * Model UiSettings
 * 
 */
export type UiSettings = $Result.DefaultSelection<Prisma.$UiSettingsPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
  TREASURER: 'TREASURER',
  SECRETARY: 'SECRETARY'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const ContributionStatus: {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

export type ContributionStatus = (typeof ContributionStatus)[keyof typeof ContributionStatus]


export const PaymentMethod: {
  MPESA: 'MPESA',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CASH: 'CASH'
};

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod]


export const PaymentStatus: {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED'
};

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]


export const DeliveryMethod: {
  IN_APP: 'IN_APP',
  EMAIL: 'EMAIL',
  SMS: 'SMS'
};

export type DeliveryMethod = (typeof DeliveryMethod)[keyof typeof DeliveryMethod]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type ContributionStatus = $Enums.ContributionStatus

export const ContributionStatus: typeof $Enums.ContributionStatus

export type PaymentMethod = $Enums.PaymentMethod

export const PaymentMethod: typeof $Enums.PaymentMethod

export type PaymentStatus = $Enums.PaymentStatus

export const PaymentStatus: typeof $Enums.PaymentStatus

export type DeliveryMethod = $Enums.DeliveryMethod

export const DeliveryMethod: typeof $Enums.DeliveryMethod

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.chama`: Exposes CRUD operations for the **Chama** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Chamas
    * const chamas = await prisma.chama.findMany()
    * ```
    */
  get chama(): Prisma.ChamaDelegate<ExtArgs>;

  /**
   * `prisma.membership`: Exposes CRUD operations for the **Membership** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Memberships
    * const memberships = await prisma.membership.findMany()
    * ```
    */
  get membership(): Prisma.MembershipDelegate<ExtArgs>;

  /**
   * `prisma.invite`: Exposes CRUD operations for the **Invite** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Invites
    * const invites = await prisma.invite.findMany()
    * ```
    */
  get invite(): Prisma.InviteDelegate<ExtArgs>;

  /**
   * `prisma.contribution`: Exposes CRUD operations for the **Contribution** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Contributions
    * const contributions = await prisma.contribution.findMany()
    * ```
    */
  get contribution(): Prisma.ContributionDelegate<ExtArgs>;

  /**
   * `prisma.payment`: Exposes CRUD operations for the **Payment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Payments
    * const payments = await prisma.payment.findMany()
    * ```
    */
  get payment(): Prisma.PaymentDelegate<ExtArgs>;

  /**
   * `prisma.notificationType`: Exposes CRUD operations for the **NotificationType** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NotificationTypes
    * const notificationTypes = await prisma.notificationType.findMany()
    * ```
    */
  get notificationType(): Prisma.NotificationTypeDelegate<ExtArgs>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs>;

  /**
   * `prisma.uiSettings`: Exposes CRUD operations for the **UiSettings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UiSettings
    * const uiSettings = await prisma.uiSettings.findMany()
    * ```
    */
  get uiSettings(): Prisma.UiSettingsDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Chama: 'Chama',
    Membership: 'Membership',
    Invite: 'Invite',
    Contribution: 'Contribution',
    Payment: 'Payment',
    NotificationType: 'NotificationType',
    Notification: 'Notification',
    UiSettings: 'UiSettings'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "chama" | "membership" | "invite" | "contribution" | "payment" | "notificationType" | "notification" | "uiSettings"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Chama: {
        payload: Prisma.$ChamaPayload<ExtArgs>
        fields: Prisma.ChamaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChamaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChamaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChamaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChamaPayload>
          }
          findFirst: {
            args: Prisma.ChamaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChamaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChamaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChamaPayload>
          }
          findMany: {
            args: Prisma.ChamaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChamaPayload>[]
          }
          create: {
            args: Prisma.ChamaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChamaPayload>
          }
          createMany: {
            args: Prisma.ChamaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChamaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChamaPayload>[]
          }
          delete: {
            args: Prisma.ChamaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChamaPayload>
          }
          update: {
            args: Prisma.ChamaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChamaPayload>
          }
          deleteMany: {
            args: Prisma.ChamaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChamaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ChamaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChamaPayload>
          }
          aggregate: {
            args: Prisma.ChamaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChama>
          }
          groupBy: {
            args: Prisma.ChamaGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChamaGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChamaCountArgs<ExtArgs>
            result: $Utils.Optional<ChamaCountAggregateOutputType> | number
          }
        }
      }
      Membership: {
        payload: Prisma.$MembershipPayload<ExtArgs>
        fields: Prisma.MembershipFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MembershipFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MembershipFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>
          }
          findFirst: {
            args: Prisma.MembershipFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MembershipFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>
          }
          findMany: {
            args: Prisma.MembershipFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>[]
          }
          create: {
            args: Prisma.MembershipCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>
          }
          createMany: {
            args: Prisma.MembershipCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MembershipCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>[]
          }
          delete: {
            args: Prisma.MembershipDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>
          }
          update: {
            args: Prisma.MembershipUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>
          }
          deleteMany: {
            args: Prisma.MembershipDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MembershipUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MembershipUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>
          }
          aggregate: {
            args: Prisma.MembershipAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMembership>
          }
          groupBy: {
            args: Prisma.MembershipGroupByArgs<ExtArgs>
            result: $Utils.Optional<MembershipGroupByOutputType>[]
          }
          count: {
            args: Prisma.MembershipCountArgs<ExtArgs>
            result: $Utils.Optional<MembershipCountAggregateOutputType> | number
          }
        }
      }
      Invite: {
        payload: Prisma.$InvitePayload<ExtArgs>
        fields: Prisma.InviteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InviteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InviteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitePayload>
          }
          findFirst: {
            args: Prisma.InviteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InviteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitePayload>
          }
          findMany: {
            args: Prisma.InviteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitePayload>[]
          }
          create: {
            args: Prisma.InviteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitePayload>
          }
          createMany: {
            args: Prisma.InviteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InviteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitePayload>[]
          }
          delete: {
            args: Prisma.InviteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitePayload>
          }
          update: {
            args: Prisma.InviteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitePayload>
          }
          deleteMany: {
            args: Prisma.InviteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InviteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InviteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitePayload>
          }
          aggregate: {
            args: Prisma.InviteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvite>
          }
          groupBy: {
            args: Prisma.InviteGroupByArgs<ExtArgs>
            result: $Utils.Optional<InviteGroupByOutputType>[]
          }
          count: {
            args: Prisma.InviteCountArgs<ExtArgs>
            result: $Utils.Optional<InviteCountAggregateOutputType> | number
          }
        }
      }
      Contribution: {
        payload: Prisma.$ContributionPayload<ExtArgs>
        fields: Prisma.ContributionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ContributionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContributionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ContributionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContributionPayload>
          }
          findFirst: {
            args: Prisma.ContributionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContributionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ContributionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContributionPayload>
          }
          findMany: {
            args: Prisma.ContributionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContributionPayload>[]
          }
          create: {
            args: Prisma.ContributionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContributionPayload>
          }
          createMany: {
            args: Prisma.ContributionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ContributionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContributionPayload>[]
          }
          delete: {
            args: Prisma.ContributionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContributionPayload>
          }
          update: {
            args: Prisma.ContributionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContributionPayload>
          }
          deleteMany: {
            args: Prisma.ContributionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ContributionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ContributionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContributionPayload>
          }
          aggregate: {
            args: Prisma.ContributionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateContribution>
          }
          groupBy: {
            args: Prisma.ContributionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ContributionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ContributionCountArgs<ExtArgs>
            result: $Utils.Optional<ContributionCountAggregateOutputType> | number
          }
        }
      }
      Payment: {
        payload: Prisma.$PaymentPayload<ExtArgs>
        fields: Prisma.PaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findFirst: {
            args: Prisma.PaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findMany: {
            args: Prisma.PaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          create: {
            args: Prisma.PaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          createMany: {
            args: Prisma.PaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          delete: {
            args: Prisma.PaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          update: {
            args: Prisma.PaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          deleteMany: {
            args: Prisma.PaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          aggregate: {
            args: Prisma.PaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayment>
          }
          groupBy: {
            args: Prisma.PaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentCountAggregateOutputType> | number
          }
        }
      }
      NotificationType: {
        payload: Prisma.$NotificationTypePayload<ExtArgs>
        fields: Prisma.NotificationTypeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationTypeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTypePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationTypeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTypePayload>
          }
          findFirst: {
            args: Prisma.NotificationTypeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTypePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationTypeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTypePayload>
          }
          findMany: {
            args: Prisma.NotificationTypeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTypePayload>[]
          }
          create: {
            args: Prisma.NotificationTypeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTypePayload>
          }
          createMany: {
            args: Prisma.NotificationTypeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationTypeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTypePayload>[]
          }
          delete: {
            args: Prisma.NotificationTypeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTypePayload>
          }
          update: {
            args: Prisma.NotificationTypeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTypePayload>
          }
          deleteMany: {
            args: Prisma.NotificationTypeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationTypeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NotificationTypeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTypePayload>
          }
          aggregate: {
            args: Prisma.NotificationTypeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotificationType>
          }
          groupBy: {
            args: Prisma.NotificationTypeGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationTypeGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationTypeCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationTypeCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
      UiSettings: {
        payload: Prisma.$UiSettingsPayload<ExtArgs>
        fields: Prisma.UiSettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UiSettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UiSettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UiSettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UiSettingsPayload>
          }
          findFirst: {
            args: Prisma.UiSettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UiSettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UiSettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UiSettingsPayload>
          }
          findMany: {
            args: Prisma.UiSettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UiSettingsPayload>[]
          }
          create: {
            args: Prisma.UiSettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UiSettingsPayload>
          }
          createMany: {
            args: Prisma.UiSettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UiSettingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UiSettingsPayload>[]
          }
          delete: {
            args: Prisma.UiSettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UiSettingsPayload>
          }
          update: {
            args: Prisma.UiSettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UiSettingsPayload>
          }
          deleteMany: {
            args: Prisma.UiSettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UiSettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UiSettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UiSettingsPayload>
          }
          aggregate: {
            args: Prisma.UiSettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUiSettings>
          }
          groupBy: {
            args: Prisma.UiSettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<UiSettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.UiSettingsCountArgs<ExtArgs>
            result: $Utils.Optional<UiSettingsCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    memberships: number
    contributions: number
    notifications: number
    Chama: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    memberships?: boolean | UserCountOutputTypeCountMembershipsArgs
    contributions?: boolean | UserCountOutputTypeCountContributionsArgs
    notifications?: boolean | UserCountOutputTypeCountNotificationsArgs
    Chama?: boolean | UserCountOutputTypeCountChamaArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMembershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MembershipWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountContributionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContributionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountChamaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChamaWhereInput
  }


  /**
   * Count Type ChamaCountOutputType
   */

  export type ChamaCountOutputType = {
    memberships: number
    contributions: number
    invites: number
  }

  export type ChamaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    memberships?: boolean | ChamaCountOutputTypeCountMembershipsArgs
    contributions?: boolean | ChamaCountOutputTypeCountContributionsArgs
    invites?: boolean | ChamaCountOutputTypeCountInvitesArgs
  }

  // Custom InputTypes
  /**
   * ChamaCountOutputType without action
   */
  export type ChamaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChamaCountOutputType
     */
    select?: ChamaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChamaCountOutputType without action
   */
  export type ChamaCountOutputTypeCountMembershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MembershipWhereInput
  }

  /**
   * ChamaCountOutputType without action
   */
  export type ChamaCountOutputTypeCountContributionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContributionWhereInput
  }

  /**
   * ChamaCountOutputType without action
   */
  export type ChamaCountOutputTypeCountInvitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InviteWhereInput
  }


  /**
   * Count Type ContributionCountOutputType
   */

  export type ContributionCountOutputType = {
    payments: number
  }

  export type ContributionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    payments?: boolean | ContributionCountOutputTypeCountPaymentsArgs
  }

  // Custom InputTypes
  /**
   * ContributionCountOutputType without action
   */
  export type ContributionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContributionCountOutputType
     */
    select?: ContributionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ContributionCountOutputType without action
   */
  export type ContributionCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
  }


  /**
   * Count Type NotificationTypeCountOutputType
   */

  export type NotificationTypeCountOutputType = {
    notifications: number
  }

  export type NotificationTypeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    notifications?: boolean | NotificationTypeCountOutputTypeCountNotificationsArgs
  }

  // Custom InputTypes
  /**
   * NotificationTypeCountOutputType without action
   */
  export type NotificationTypeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationTypeCountOutputType
     */
    select?: NotificationTypeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * NotificationTypeCountOutputType without action
   */
  export type NotificationTypeCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    phone: string | null
    passwordHash: string | null
    role: $Enums.UserRole | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    phone: string | null
    passwordHash: string | null
    role: $Enums.UserRole | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    phone: number
    passwordHash: number
    role: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    passwordHash?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    passwordHash?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    passwordHash?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string | null
    email: string | null
    phone: string | null
    passwordHash: string | null
    role: $Enums.UserRole
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    passwordHash?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    memberships?: boolean | User$membershipsArgs<ExtArgs>
    contributions?: boolean | User$contributionsArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    uiSettings?: boolean | User$uiSettingsArgs<ExtArgs>
    Chama?: boolean | User$ChamaArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    passwordHash?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    passwordHash?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    memberships?: boolean | User$membershipsArgs<ExtArgs>
    contributions?: boolean | User$contributionsArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    uiSettings?: boolean | User$uiSettingsArgs<ExtArgs>
    Chama?: boolean | User$ChamaArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      memberships: Prisma.$MembershipPayload<ExtArgs>[]
      contributions: Prisma.$ContributionPayload<ExtArgs>[]
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
      uiSettings: Prisma.$UiSettingsPayload<ExtArgs> | null
      Chama: Prisma.$ChamaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      email: string | null
      phone: string | null
      passwordHash: string | null
      role: $Enums.UserRole
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    memberships<T extends User$membershipsArgs<ExtArgs> = {}>(args?: Subset<T, User$membershipsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findMany"> | Null>
    contributions<T extends User$contributionsArgs<ExtArgs> = {}>(args?: Subset<T, User$contributionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContributionPayload<ExtArgs>, T, "findMany"> | Null>
    notifications<T extends User$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, User$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany"> | Null>
    uiSettings<T extends User$uiSettingsArgs<ExtArgs> = {}>(args?: Subset<T, User$uiSettingsArgs<ExtArgs>>): Prisma__UiSettingsClient<$Result.GetResult<Prisma.$UiSettingsPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    Chama<T extends User$ChamaArgs<ExtArgs> = {}>(args?: Subset<T, User$ChamaArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChamaPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.memberships
   */
  export type User$membershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    where?: MembershipWhereInput
    orderBy?: MembershipOrderByWithRelationInput | MembershipOrderByWithRelationInput[]
    cursor?: MembershipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MembershipScalarFieldEnum | MembershipScalarFieldEnum[]
  }

  /**
   * User.contributions
   */
  export type User$contributionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contribution
     */
    select?: ContributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContributionInclude<ExtArgs> | null
    where?: ContributionWhereInput
    orderBy?: ContributionOrderByWithRelationInput | ContributionOrderByWithRelationInput[]
    cursor?: ContributionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ContributionScalarFieldEnum | ContributionScalarFieldEnum[]
  }

  /**
   * User.notifications
   */
  export type User$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * User.uiSettings
   */
  export type User$uiSettingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UiSettings
     */
    select?: UiSettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UiSettingsInclude<ExtArgs> | null
    where?: UiSettingsWhereInput
  }

  /**
   * User.Chama
   */
  export type User$ChamaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chama
     */
    select?: ChamaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChamaInclude<ExtArgs> | null
    where?: ChamaWhereInput
    orderBy?: ChamaOrderByWithRelationInput | ChamaOrderByWithRelationInput[]
    cursor?: ChamaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChamaScalarFieldEnum | ChamaScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Chama
   */

  export type AggregateChama = {
    _count: ChamaCountAggregateOutputType | null
    _min: ChamaMinAggregateOutputType | null
    _max: ChamaMaxAggregateOutputType | null
  }

  export type ChamaMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    rules: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChamaMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    rules: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChamaCountAggregateOutputType = {
    id: number
    name: number
    description: number
    rules: number
    userId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ChamaMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    rules?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChamaMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    rules?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChamaCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    rules?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ChamaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Chama to aggregate.
     */
    where?: ChamaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Chamas to fetch.
     */
    orderBy?: ChamaOrderByWithRelationInput | ChamaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChamaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Chamas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Chamas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Chamas
    **/
    _count?: true | ChamaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChamaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChamaMaxAggregateInputType
  }

  export type GetChamaAggregateType<T extends ChamaAggregateArgs> = {
        [P in keyof T & keyof AggregateChama]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChama[P]>
      : GetScalarType<T[P], AggregateChama[P]>
  }




  export type ChamaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChamaWhereInput
    orderBy?: ChamaOrderByWithAggregationInput | ChamaOrderByWithAggregationInput[]
    by: ChamaScalarFieldEnum[] | ChamaScalarFieldEnum
    having?: ChamaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChamaCountAggregateInputType | true
    _min?: ChamaMinAggregateInputType
    _max?: ChamaMaxAggregateInputType
  }

  export type ChamaGroupByOutputType = {
    id: string
    name: string
    description: string | null
    rules: string | null
    userId: string
    createdAt: Date
    updatedAt: Date
    _count: ChamaCountAggregateOutputType | null
    _min: ChamaMinAggregateOutputType | null
    _max: ChamaMaxAggregateOutputType | null
  }

  type GetChamaGroupByPayload<T extends ChamaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChamaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChamaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChamaGroupByOutputType[P]>
            : GetScalarType<T[P], ChamaGroupByOutputType[P]>
        }
      >
    >


  export type ChamaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    rules?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    memberships?: boolean | Chama$membershipsArgs<ExtArgs>
    contributions?: boolean | Chama$contributionsArgs<ExtArgs>
    invites?: boolean | Chama$invitesArgs<ExtArgs>
    _count?: boolean | ChamaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chama"]>

  export type ChamaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    rules?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chama"]>

  export type ChamaSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    rules?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ChamaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    memberships?: boolean | Chama$membershipsArgs<ExtArgs>
    contributions?: boolean | Chama$contributionsArgs<ExtArgs>
    invites?: boolean | Chama$invitesArgs<ExtArgs>
    _count?: boolean | ChamaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ChamaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ChamaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Chama"
    objects: {
      createdBy: Prisma.$UserPayload<ExtArgs>
      memberships: Prisma.$MembershipPayload<ExtArgs>[]
      contributions: Prisma.$ContributionPayload<ExtArgs>[]
      invites: Prisma.$InvitePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      rules: string | null
      userId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["chama"]>
    composites: {}
  }

  type ChamaGetPayload<S extends boolean | null | undefined | ChamaDefaultArgs> = $Result.GetResult<Prisma.$ChamaPayload, S>

  type ChamaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ChamaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ChamaCountAggregateInputType | true
    }

  export interface ChamaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Chama'], meta: { name: 'Chama' } }
    /**
     * Find zero or one Chama that matches the filter.
     * @param {ChamaFindUniqueArgs} args - Arguments to find a Chama
     * @example
     * // Get one Chama
     * const chama = await prisma.chama.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChamaFindUniqueArgs>(args: SelectSubset<T, ChamaFindUniqueArgs<ExtArgs>>): Prisma__ChamaClient<$Result.GetResult<Prisma.$ChamaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Chama that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ChamaFindUniqueOrThrowArgs} args - Arguments to find a Chama
     * @example
     * // Get one Chama
     * const chama = await prisma.chama.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChamaFindUniqueOrThrowArgs>(args: SelectSubset<T, ChamaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChamaClient<$Result.GetResult<Prisma.$ChamaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Chama that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChamaFindFirstArgs} args - Arguments to find a Chama
     * @example
     * // Get one Chama
     * const chama = await prisma.chama.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChamaFindFirstArgs>(args?: SelectSubset<T, ChamaFindFirstArgs<ExtArgs>>): Prisma__ChamaClient<$Result.GetResult<Prisma.$ChamaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Chama that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChamaFindFirstOrThrowArgs} args - Arguments to find a Chama
     * @example
     * // Get one Chama
     * const chama = await prisma.chama.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChamaFindFirstOrThrowArgs>(args?: SelectSubset<T, ChamaFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChamaClient<$Result.GetResult<Prisma.$ChamaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Chamas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChamaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Chamas
     * const chamas = await prisma.chama.findMany()
     * 
     * // Get first 10 Chamas
     * const chamas = await prisma.chama.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chamaWithIdOnly = await prisma.chama.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChamaFindManyArgs>(args?: SelectSubset<T, ChamaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChamaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Chama.
     * @param {ChamaCreateArgs} args - Arguments to create a Chama.
     * @example
     * // Create one Chama
     * const Chama = await prisma.chama.create({
     *   data: {
     *     // ... data to create a Chama
     *   }
     * })
     * 
     */
    create<T extends ChamaCreateArgs>(args: SelectSubset<T, ChamaCreateArgs<ExtArgs>>): Prisma__ChamaClient<$Result.GetResult<Prisma.$ChamaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Chamas.
     * @param {ChamaCreateManyArgs} args - Arguments to create many Chamas.
     * @example
     * // Create many Chamas
     * const chama = await prisma.chama.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChamaCreateManyArgs>(args?: SelectSubset<T, ChamaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Chamas and returns the data saved in the database.
     * @param {ChamaCreateManyAndReturnArgs} args - Arguments to create many Chamas.
     * @example
     * // Create many Chamas
     * const chama = await prisma.chama.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Chamas and only return the `id`
     * const chamaWithIdOnly = await prisma.chama.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChamaCreateManyAndReturnArgs>(args?: SelectSubset<T, ChamaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChamaPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Chama.
     * @param {ChamaDeleteArgs} args - Arguments to delete one Chama.
     * @example
     * // Delete one Chama
     * const Chama = await prisma.chama.delete({
     *   where: {
     *     // ... filter to delete one Chama
     *   }
     * })
     * 
     */
    delete<T extends ChamaDeleteArgs>(args: SelectSubset<T, ChamaDeleteArgs<ExtArgs>>): Prisma__ChamaClient<$Result.GetResult<Prisma.$ChamaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Chama.
     * @param {ChamaUpdateArgs} args - Arguments to update one Chama.
     * @example
     * // Update one Chama
     * const chama = await prisma.chama.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChamaUpdateArgs>(args: SelectSubset<T, ChamaUpdateArgs<ExtArgs>>): Prisma__ChamaClient<$Result.GetResult<Prisma.$ChamaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Chamas.
     * @param {ChamaDeleteManyArgs} args - Arguments to filter Chamas to delete.
     * @example
     * // Delete a few Chamas
     * const { count } = await prisma.chama.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChamaDeleteManyArgs>(args?: SelectSubset<T, ChamaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Chamas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChamaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Chamas
     * const chama = await prisma.chama.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChamaUpdateManyArgs>(args: SelectSubset<T, ChamaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Chama.
     * @param {ChamaUpsertArgs} args - Arguments to update or create a Chama.
     * @example
     * // Update or create a Chama
     * const chama = await prisma.chama.upsert({
     *   create: {
     *     // ... data to create a Chama
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Chama we want to update
     *   }
     * })
     */
    upsert<T extends ChamaUpsertArgs>(args: SelectSubset<T, ChamaUpsertArgs<ExtArgs>>): Prisma__ChamaClient<$Result.GetResult<Prisma.$ChamaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Chamas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChamaCountArgs} args - Arguments to filter Chamas to count.
     * @example
     * // Count the number of Chamas
     * const count = await prisma.chama.count({
     *   where: {
     *     // ... the filter for the Chamas we want to count
     *   }
     * })
    **/
    count<T extends ChamaCountArgs>(
      args?: Subset<T, ChamaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChamaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Chama.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChamaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChamaAggregateArgs>(args: Subset<T, ChamaAggregateArgs>): Prisma.PrismaPromise<GetChamaAggregateType<T>>

    /**
     * Group by Chama.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChamaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChamaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChamaGroupByArgs['orderBy'] }
        : { orderBy?: ChamaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChamaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChamaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Chama model
   */
  readonly fields: ChamaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Chama.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChamaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    createdBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    memberships<T extends Chama$membershipsArgs<ExtArgs> = {}>(args?: Subset<T, Chama$membershipsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findMany"> | Null>
    contributions<T extends Chama$contributionsArgs<ExtArgs> = {}>(args?: Subset<T, Chama$contributionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContributionPayload<ExtArgs>, T, "findMany"> | Null>
    invites<T extends Chama$invitesArgs<ExtArgs> = {}>(args?: Subset<T, Chama$invitesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvitePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Chama model
   */ 
  interface ChamaFieldRefs {
    readonly id: FieldRef<"Chama", 'String'>
    readonly name: FieldRef<"Chama", 'String'>
    readonly description: FieldRef<"Chama", 'String'>
    readonly rules: FieldRef<"Chama", 'String'>
    readonly userId: FieldRef<"Chama", 'String'>
    readonly createdAt: FieldRef<"Chama", 'DateTime'>
    readonly updatedAt: FieldRef<"Chama", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Chama findUnique
   */
  export type ChamaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chama
     */
    select?: ChamaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChamaInclude<ExtArgs> | null
    /**
     * Filter, which Chama to fetch.
     */
    where: ChamaWhereUniqueInput
  }

  /**
   * Chama findUniqueOrThrow
   */
  export type ChamaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chama
     */
    select?: ChamaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChamaInclude<ExtArgs> | null
    /**
     * Filter, which Chama to fetch.
     */
    where: ChamaWhereUniqueInput
  }

  /**
   * Chama findFirst
   */
  export type ChamaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chama
     */
    select?: ChamaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChamaInclude<ExtArgs> | null
    /**
     * Filter, which Chama to fetch.
     */
    where?: ChamaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Chamas to fetch.
     */
    orderBy?: ChamaOrderByWithRelationInput | ChamaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Chamas.
     */
    cursor?: ChamaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Chamas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Chamas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Chamas.
     */
    distinct?: ChamaScalarFieldEnum | ChamaScalarFieldEnum[]
  }

  /**
   * Chama findFirstOrThrow
   */
  export type ChamaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chama
     */
    select?: ChamaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChamaInclude<ExtArgs> | null
    /**
     * Filter, which Chama to fetch.
     */
    where?: ChamaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Chamas to fetch.
     */
    orderBy?: ChamaOrderByWithRelationInput | ChamaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Chamas.
     */
    cursor?: ChamaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Chamas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Chamas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Chamas.
     */
    distinct?: ChamaScalarFieldEnum | ChamaScalarFieldEnum[]
  }

  /**
   * Chama findMany
   */
  export type ChamaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chama
     */
    select?: ChamaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChamaInclude<ExtArgs> | null
    /**
     * Filter, which Chamas to fetch.
     */
    where?: ChamaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Chamas to fetch.
     */
    orderBy?: ChamaOrderByWithRelationInput | ChamaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Chamas.
     */
    cursor?: ChamaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Chamas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Chamas.
     */
    skip?: number
    distinct?: ChamaScalarFieldEnum | ChamaScalarFieldEnum[]
  }

  /**
   * Chama create
   */
  export type ChamaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chama
     */
    select?: ChamaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChamaInclude<ExtArgs> | null
    /**
     * The data needed to create a Chama.
     */
    data: XOR<ChamaCreateInput, ChamaUncheckedCreateInput>
  }

  /**
   * Chama createMany
   */
  export type ChamaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Chamas.
     */
    data: ChamaCreateManyInput | ChamaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Chama createManyAndReturn
   */
  export type ChamaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chama
     */
    select?: ChamaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Chamas.
     */
    data: ChamaCreateManyInput | ChamaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChamaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Chama update
   */
  export type ChamaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chama
     */
    select?: ChamaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChamaInclude<ExtArgs> | null
    /**
     * The data needed to update a Chama.
     */
    data: XOR<ChamaUpdateInput, ChamaUncheckedUpdateInput>
    /**
     * Choose, which Chama to update.
     */
    where: ChamaWhereUniqueInput
  }

  /**
   * Chama updateMany
   */
  export type ChamaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Chamas.
     */
    data: XOR<ChamaUpdateManyMutationInput, ChamaUncheckedUpdateManyInput>
    /**
     * Filter which Chamas to update
     */
    where?: ChamaWhereInput
  }

  /**
   * Chama upsert
   */
  export type ChamaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chama
     */
    select?: ChamaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChamaInclude<ExtArgs> | null
    /**
     * The filter to search for the Chama to update in case it exists.
     */
    where: ChamaWhereUniqueInput
    /**
     * In case the Chama found by the `where` argument doesn't exist, create a new Chama with this data.
     */
    create: XOR<ChamaCreateInput, ChamaUncheckedCreateInput>
    /**
     * In case the Chama was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChamaUpdateInput, ChamaUncheckedUpdateInput>
  }

  /**
   * Chama delete
   */
  export type ChamaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chama
     */
    select?: ChamaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChamaInclude<ExtArgs> | null
    /**
     * Filter which Chama to delete.
     */
    where: ChamaWhereUniqueInput
  }

  /**
   * Chama deleteMany
   */
  export type ChamaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Chamas to delete
     */
    where?: ChamaWhereInput
  }

  /**
   * Chama.memberships
   */
  export type Chama$membershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    where?: MembershipWhereInput
    orderBy?: MembershipOrderByWithRelationInput | MembershipOrderByWithRelationInput[]
    cursor?: MembershipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MembershipScalarFieldEnum | MembershipScalarFieldEnum[]
  }

  /**
   * Chama.contributions
   */
  export type Chama$contributionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contribution
     */
    select?: ContributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContributionInclude<ExtArgs> | null
    where?: ContributionWhereInput
    orderBy?: ContributionOrderByWithRelationInput | ContributionOrderByWithRelationInput[]
    cursor?: ContributionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ContributionScalarFieldEnum | ContributionScalarFieldEnum[]
  }

  /**
   * Chama.invites
   */
  export type Chama$invitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteInclude<ExtArgs> | null
    where?: InviteWhereInput
    orderBy?: InviteOrderByWithRelationInput | InviteOrderByWithRelationInput[]
    cursor?: InviteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InviteScalarFieldEnum | InviteScalarFieldEnum[]
  }

  /**
   * Chama without action
   */
  export type ChamaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chama
     */
    select?: ChamaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChamaInclude<ExtArgs> | null
  }


  /**
   * Model Membership
   */

  export type AggregateMembership = {
    _count: MembershipCountAggregateOutputType | null
    _min: MembershipMinAggregateOutputType | null
    _max: MembershipMaxAggregateOutputType | null
  }

  export type MembershipMinAggregateOutputType = {
    id: string | null
    userId: string | null
    chamaId: string | null
    role: $Enums.UserRole | null
    joinedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MembershipMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    chamaId: string | null
    role: $Enums.UserRole | null
    joinedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MembershipCountAggregateOutputType = {
    id: number
    userId: number
    chamaId: number
    role: number
    joinedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MembershipMinAggregateInputType = {
    id?: true
    userId?: true
    chamaId?: true
    role?: true
    joinedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MembershipMaxAggregateInputType = {
    id?: true
    userId?: true
    chamaId?: true
    role?: true
    joinedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MembershipCountAggregateInputType = {
    id?: true
    userId?: true
    chamaId?: true
    role?: true
    joinedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MembershipAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Membership to aggregate.
     */
    where?: MembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Memberships to fetch.
     */
    orderBy?: MembershipOrderByWithRelationInput | MembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Memberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Memberships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Memberships
    **/
    _count?: true | MembershipCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MembershipMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MembershipMaxAggregateInputType
  }

  export type GetMembershipAggregateType<T extends MembershipAggregateArgs> = {
        [P in keyof T & keyof AggregateMembership]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMembership[P]>
      : GetScalarType<T[P], AggregateMembership[P]>
  }




  export type MembershipGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MembershipWhereInput
    orderBy?: MembershipOrderByWithAggregationInput | MembershipOrderByWithAggregationInput[]
    by: MembershipScalarFieldEnum[] | MembershipScalarFieldEnum
    having?: MembershipScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MembershipCountAggregateInputType | true
    _min?: MembershipMinAggregateInputType
    _max?: MembershipMaxAggregateInputType
  }

  export type MembershipGroupByOutputType = {
    id: string
    userId: string
    chamaId: string
    role: $Enums.UserRole
    joinedAt: Date
    createdAt: Date
    updatedAt: Date
    _count: MembershipCountAggregateOutputType | null
    _min: MembershipMinAggregateOutputType | null
    _max: MembershipMaxAggregateOutputType | null
  }

  type GetMembershipGroupByPayload<T extends MembershipGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MembershipGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MembershipGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MembershipGroupByOutputType[P]>
            : GetScalarType<T[P], MembershipGroupByOutputType[P]>
        }
      >
    >


  export type MembershipSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    chamaId?: boolean
    role?: boolean
    joinedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    chama?: boolean | ChamaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["membership"]>

  export type MembershipSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    chamaId?: boolean
    role?: boolean
    joinedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    chama?: boolean | ChamaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["membership"]>

  export type MembershipSelectScalar = {
    id?: boolean
    userId?: boolean
    chamaId?: boolean
    role?: boolean
    joinedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MembershipInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    chama?: boolean | ChamaDefaultArgs<ExtArgs>
  }
  export type MembershipIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    chama?: boolean | ChamaDefaultArgs<ExtArgs>
  }

  export type $MembershipPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Membership"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      chama: Prisma.$ChamaPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      chamaId: string
      role: $Enums.UserRole
      joinedAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["membership"]>
    composites: {}
  }

  type MembershipGetPayload<S extends boolean | null | undefined | MembershipDefaultArgs> = $Result.GetResult<Prisma.$MembershipPayload, S>

  type MembershipCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MembershipFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MembershipCountAggregateInputType | true
    }

  export interface MembershipDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Membership'], meta: { name: 'Membership' } }
    /**
     * Find zero or one Membership that matches the filter.
     * @param {MembershipFindUniqueArgs} args - Arguments to find a Membership
     * @example
     * // Get one Membership
     * const membership = await prisma.membership.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MembershipFindUniqueArgs>(args: SelectSubset<T, MembershipFindUniqueArgs<ExtArgs>>): Prisma__MembershipClient<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Membership that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MembershipFindUniqueOrThrowArgs} args - Arguments to find a Membership
     * @example
     * // Get one Membership
     * const membership = await prisma.membership.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MembershipFindUniqueOrThrowArgs>(args: SelectSubset<T, MembershipFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MembershipClient<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Membership that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembershipFindFirstArgs} args - Arguments to find a Membership
     * @example
     * // Get one Membership
     * const membership = await prisma.membership.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MembershipFindFirstArgs>(args?: SelectSubset<T, MembershipFindFirstArgs<ExtArgs>>): Prisma__MembershipClient<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Membership that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembershipFindFirstOrThrowArgs} args - Arguments to find a Membership
     * @example
     * // Get one Membership
     * const membership = await prisma.membership.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MembershipFindFirstOrThrowArgs>(args?: SelectSubset<T, MembershipFindFirstOrThrowArgs<ExtArgs>>): Prisma__MembershipClient<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Memberships that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembershipFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Memberships
     * const memberships = await prisma.membership.findMany()
     * 
     * // Get first 10 Memberships
     * const memberships = await prisma.membership.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const membershipWithIdOnly = await prisma.membership.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MembershipFindManyArgs>(args?: SelectSubset<T, MembershipFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Membership.
     * @param {MembershipCreateArgs} args - Arguments to create a Membership.
     * @example
     * // Create one Membership
     * const Membership = await prisma.membership.create({
     *   data: {
     *     // ... data to create a Membership
     *   }
     * })
     * 
     */
    create<T extends MembershipCreateArgs>(args: SelectSubset<T, MembershipCreateArgs<ExtArgs>>): Prisma__MembershipClient<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Memberships.
     * @param {MembershipCreateManyArgs} args - Arguments to create many Memberships.
     * @example
     * // Create many Memberships
     * const membership = await prisma.membership.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MembershipCreateManyArgs>(args?: SelectSubset<T, MembershipCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Memberships and returns the data saved in the database.
     * @param {MembershipCreateManyAndReturnArgs} args - Arguments to create many Memberships.
     * @example
     * // Create many Memberships
     * const membership = await prisma.membership.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Memberships and only return the `id`
     * const membershipWithIdOnly = await prisma.membership.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MembershipCreateManyAndReturnArgs>(args?: SelectSubset<T, MembershipCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Membership.
     * @param {MembershipDeleteArgs} args - Arguments to delete one Membership.
     * @example
     * // Delete one Membership
     * const Membership = await prisma.membership.delete({
     *   where: {
     *     // ... filter to delete one Membership
     *   }
     * })
     * 
     */
    delete<T extends MembershipDeleteArgs>(args: SelectSubset<T, MembershipDeleteArgs<ExtArgs>>): Prisma__MembershipClient<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Membership.
     * @param {MembershipUpdateArgs} args - Arguments to update one Membership.
     * @example
     * // Update one Membership
     * const membership = await prisma.membership.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MembershipUpdateArgs>(args: SelectSubset<T, MembershipUpdateArgs<ExtArgs>>): Prisma__MembershipClient<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Memberships.
     * @param {MembershipDeleteManyArgs} args - Arguments to filter Memberships to delete.
     * @example
     * // Delete a few Memberships
     * const { count } = await prisma.membership.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MembershipDeleteManyArgs>(args?: SelectSubset<T, MembershipDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Memberships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembershipUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Memberships
     * const membership = await prisma.membership.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MembershipUpdateManyArgs>(args: SelectSubset<T, MembershipUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Membership.
     * @param {MembershipUpsertArgs} args - Arguments to update or create a Membership.
     * @example
     * // Update or create a Membership
     * const membership = await prisma.membership.upsert({
     *   create: {
     *     // ... data to create a Membership
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Membership we want to update
     *   }
     * })
     */
    upsert<T extends MembershipUpsertArgs>(args: SelectSubset<T, MembershipUpsertArgs<ExtArgs>>): Prisma__MembershipClient<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Memberships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembershipCountArgs} args - Arguments to filter Memberships to count.
     * @example
     * // Count the number of Memberships
     * const count = await prisma.membership.count({
     *   where: {
     *     // ... the filter for the Memberships we want to count
     *   }
     * })
    **/
    count<T extends MembershipCountArgs>(
      args?: Subset<T, MembershipCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MembershipCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Membership.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembershipAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MembershipAggregateArgs>(args: Subset<T, MembershipAggregateArgs>): Prisma.PrismaPromise<GetMembershipAggregateType<T>>

    /**
     * Group by Membership.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembershipGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MembershipGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MembershipGroupByArgs['orderBy'] }
        : { orderBy?: MembershipGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MembershipGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMembershipGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Membership model
   */
  readonly fields: MembershipFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Membership.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MembershipClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    chama<T extends ChamaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChamaDefaultArgs<ExtArgs>>): Prisma__ChamaClient<$Result.GetResult<Prisma.$ChamaPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Membership model
   */ 
  interface MembershipFieldRefs {
    readonly id: FieldRef<"Membership", 'String'>
    readonly userId: FieldRef<"Membership", 'String'>
    readonly chamaId: FieldRef<"Membership", 'String'>
    readonly role: FieldRef<"Membership", 'UserRole'>
    readonly joinedAt: FieldRef<"Membership", 'DateTime'>
    readonly createdAt: FieldRef<"Membership", 'DateTime'>
    readonly updatedAt: FieldRef<"Membership", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Membership findUnique
   */
  export type MembershipFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * Filter, which Membership to fetch.
     */
    where: MembershipWhereUniqueInput
  }

  /**
   * Membership findUniqueOrThrow
   */
  export type MembershipFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * Filter, which Membership to fetch.
     */
    where: MembershipWhereUniqueInput
  }

  /**
   * Membership findFirst
   */
  export type MembershipFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * Filter, which Membership to fetch.
     */
    where?: MembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Memberships to fetch.
     */
    orderBy?: MembershipOrderByWithRelationInput | MembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Memberships.
     */
    cursor?: MembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Memberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Memberships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Memberships.
     */
    distinct?: MembershipScalarFieldEnum | MembershipScalarFieldEnum[]
  }

  /**
   * Membership findFirstOrThrow
   */
  export type MembershipFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * Filter, which Membership to fetch.
     */
    where?: MembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Memberships to fetch.
     */
    orderBy?: MembershipOrderByWithRelationInput | MembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Memberships.
     */
    cursor?: MembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Memberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Memberships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Memberships.
     */
    distinct?: MembershipScalarFieldEnum | MembershipScalarFieldEnum[]
  }

  /**
   * Membership findMany
   */
  export type MembershipFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * Filter, which Memberships to fetch.
     */
    where?: MembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Memberships to fetch.
     */
    orderBy?: MembershipOrderByWithRelationInput | MembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Memberships.
     */
    cursor?: MembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Memberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Memberships.
     */
    skip?: number
    distinct?: MembershipScalarFieldEnum | MembershipScalarFieldEnum[]
  }

  /**
   * Membership create
   */
  export type MembershipCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * The data needed to create a Membership.
     */
    data: XOR<MembershipCreateInput, MembershipUncheckedCreateInput>
  }

  /**
   * Membership createMany
   */
  export type MembershipCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Memberships.
     */
    data: MembershipCreateManyInput | MembershipCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Membership createManyAndReturn
   */
  export type MembershipCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Memberships.
     */
    data: MembershipCreateManyInput | MembershipCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Membership update
   */
  export type MembershipUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * The data needed to update a Membership.
     */
    data: XOR<MembershipUpdateInput, MembershipUncheckedUpdateInput>
    /**
     * Choose, which Membership to update.
     */
    where: MembershipWhereUniqueInput
  }

  /**
   * Membership updateMany
   */
  export type MembershipUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Memberships.
     */
    data: XOR<MembershipUpdateManyMutationInput, MembershipUncheckedUpdateManyInput>
    /**
     * Filter which Memberships to update
     */
    where?: MembershipWhereInput
  }

  /**
   * Membership upsert
   */
  export type MembershipUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * The filter to search for the Membership to update in case it exists.
     */
    where: MembershipWhereUniqueInput
    /**
     * In case the Membership found by the `where` argument doesn't exist, create a new Membership with this data.
     */
    create: XOR<MembershipCreateInput, MembershipUncheckedCreateInput>
    /**
     * In case the Membership was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MembershipUpdateInput, MembershipUncheckedUpdateInput>
  }

  /**
   * Membership delete
   */
  export type MembershipDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * Filter which Membership to delete.
     */
    where: MembershipWhereUniqueInput
  }

  /**
   * Membership deleteMany
   */
  export type MembershipDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Memberships to delete
     */
    where?: MembershipWhereInput
  }

  /**
   * Membership without action
   */
  export type MembershipDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
  }


  /**
   * Model Invite
   */

  export type AggregateInvite = {
    _count: InviteCountAggregateOutputType | null
    _min: InviteMinAggregateOutputType | null
    _max: InviteMaxAggregateOutputType | null
  }

  export type InviteMinAggregateOutputType = {
    id: string | null
    chamaId: string | null
    token: string | null
    sentToEmail: string | null
    expiresAt: Date | null
    usedAt: Date | null
    createdAt: Date | null
  }

  export type InviteMaxAggregateOutputType = {
    id: string | null
    chamaId: string | null
    token: string | null
    sentToEmail: string | null
    expiresAt: Date | null
    usedAt: Date | null
    createdAt: Date | null
  }

  export type InviteCountAggregateOutputType = {
    id: number
    chamaId: number
    token: number
    sentToEmail: number
    expiresAt: number
    usedAt: number
    createdAt: number
    _all: number
  }


  export type InviteMinAggregateInputType = {
    id?: true
    chamaId?: true
    token?: true
    sentToEmail?: true
    expiresAt?: true
    usedAt?: true
    createdAt?: true
  }

  export type InviteMaxAggregateInputType = {
    id?: true
    chamaId?: true
    token?: true
    sentToEmail?: true
    expiresAt?: true
    usedAt?: true
    createdAt?: true
  }

  export type InviteCountAggregateInputType = {
    id?: true
    chamaId?: true
    token?: true
    sentToEmail?: true
    expiresAt?: true
    usedAt?: true
    createdAt?: true
    _all?: true
  }

  export type InviteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invite to aggregate.
     */
    where?: InviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invites to fetch.
     */
    orderBy?: InviteOrderByWithRelationInput | InviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Invites
    **/
    _count?: true | InviteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InviteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InviteMaxAggregateInputType
  }

  export type GetInviteAggregateType<T extends InviteAggregateArgs> = {
        [P in keyof T & keyof AggregateInvite]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvite[P]>
      : GetScalarType<T[P], AggregateInvite[P]>
  }




  export type InviteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InviteWhereInput
    orderBy?: InviteOrderByWithAggregationInput | InviteOrderByWithAggregationInput[]
    by: InviteScalarFieldEnum[] | InviteScalarFieldEnum
    having?: InviteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InviteCountAggregateInputType | true
    _min?: InviteMinAggregateInputType
    _max?: InviteMaxAggregateInputType
  }

  export type InviteGroupByOutputType = {
    id: string
    chamaId: string
    token: string
    sentToEmail: string
    expiresAt: Date
    usedAt: Date | null
    createdAt: Date
    _count: InviteCountAggregateOutputType | null
    _min: InviteMinAggregateOutputType | null
    _max: InviteMaxAggregateOutputType | null
  }

  type GetInviteGroupByPayload<T extends InviteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InviteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InviteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InviteGroupByOutputType[P]>
            : GetScalarType<T[P], InviteGroupByOutputType[P]>
        }
      >
    >


  export type InviteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chamaId?: boolean
    token?: boolean
    sentToEmail?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
    chama?: boolean | ChamaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invite"]>

  export type InviteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chamaId?: boolean
    token?: boolean
    sentToEmail?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
    chama?: boolean | ChamaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invite"]>

  export type InviteSelectScalar = {
    id?: boolean
    chamaId?: boolean
    token?: boolean
    sentToEmail?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
  }

  export type InviteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chama?: boolean | ChamaDefaultArgs<ExtArgs>
  }
  export type InviteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chama?: boolean | ChamaDefaultArgs<ExtArgs>
  }

  export type $InvitePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Invite"
    objects: {
      chama: Prisma.$ChamaPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      chamaId: string
      token: string
      sentToEmail: string
      expiresAt: Date
      usedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["invite"]>
    composites: {}
  }

  type InviteGetPayload<S extends boolean | null | undefined | InviteDefaultArgs> = $Result.GetResult<Prisma.$InvitePayload, S>

  type InviteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InviteFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InviteCountAggregateInputType | true
    }

  export interface InviteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Invite'], meta: { name: 'Invite' } }
    /**
     * Find zero or one Invite that matches the filter.
     * @param {InviteFindUniqueArgs} args - Arguments to find a Invite
     * @example
     * // Get one Invite
     * const invite = await prisma.invite.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InviteFindUniqueArgs>(args: SelectSubset<T, InviteFindUniqueArgs<ExtArgs>>): Prisma__InviteClient<$Result.GetResult<Prisma.$InvitePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Invite that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InviteFindUniqueOrThrowArgs} args - Arguments to find a Invite
     * @example
     * // Get one Invite
     * const invite = await prisma.invite.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InviteFindUniqueOrThrowArgs>(args: SelectSubset<T, InviteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InviteClient<$Result.GetResult<Prisma.$InvitePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Invite that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InviteFindFirstArgs} args - Arguments to find a Invite
     * @example
     * // Get one Invite
     * const invite = await prisma.invite.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InviteFindFirstArgs>(args?: SelectSubset<T, InviteFindFirstArgs<ExtArgs>>): Prisma__InviteClient<$Result.GetResult<Prisma.$InvitePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Invite that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InviteFindFirstOrThrowArgs} args - Arguments to find a Invite
     * @example
     * // Get one Invite
     * const invite = await prisma.invite.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InviteFindFirstOrThrowArgs>(args?: SelectSubset<T, InviteFindFirstOrThrowArgs<ExtArgs>>): Prisma__InviteClient<$Result.GetResult<Prisma.$InvitePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Invites that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InviteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Invites
     * const invites = await prisma.invite.findMany()
     * 
     * // Get first 10 Invites
     * const invites = await prisma.invite.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inviteWithIdOnly = await prisma.invite.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InviteFindManyArgs>(args?: SelectSubset<T, InviteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvitePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Invite.
     * @param {InviteCreateArgs} args - Arguments to create a Invite.
     * @example
     * // Create one Invite
     * const Invite = await prisma.invite.create({
     *   data: {
     *     // ... data to create a Invite
     *   }
     * })
     * 
     */
    create<T extends InviteCreateArgs>(args: SelectSubset<T, InviteCreateArgs<ExtArgs>>): Prisma__InviteClient<$Result.GetResult<Prisma.$InvitePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Invites.
     * @param {InviteCreateManyArgs} args - Arguments to create many Invites.
     * @example
     * // Create many Invites
     * const invite = await prisma.invite.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InviteCreateManyArgs>(args?: SelectSubset<T, InviteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Invites and returns the data saved in the database.
     * @param {InviteCreateManyAndReturnArgs} args - Arguments to create many Invites.
     * @example
     * // Create many Invites
     * const invite = await prisma.invite.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Invites and only return the `id`
     * const inviteWithIdOnly = await prisma.invite.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InviteCreateManyAndReturnArgs>(args?: SelectSubset<T, InviteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvitePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Invite.
     * @param {InviteDeleteArgs} args - Arguments to delete one Invite.
     * @example
     * // Delete one Invite
     * const Invite = await prisma.invite.delete({
     *   where: {
     *     // ... filter to delete one Invite
     *   }
     * })
     * 
     */
    delete<T extends InviteDeleteArgs>(args: SelectSubset<T, InviteDeleteArgs<ExtArgs>>): Prisma__InviteClient<$Result.GetResult<Prisma.$InvitePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Invite.
     * @param {InviteUpdateArgs} args - Arguments to update one Invite.
     * @example
     * // Update one Invite
     * const invite = await prisma.invite.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InviteUpdateArgs>(args: SelectSubset<T, InviteUpdateArgs<ExtArgs>>): Prisma__InviteClient<$Result.GetResult<Prisma.$InvitePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Invites.
     * @param {InviteDeleteManyArgs} args - Arguments to filter Invites to delete.
     * @example
     * // Delete a few Invites
     * const { count } = await prisma.invite.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InviteDeleteManyArgs>(args?: SelectSubset<T, InviteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Invites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InviteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Invites
     * const invite = await prisma.invite.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InviteUpdateManyArgs>(args: SelectSubset<T, InviteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Invite.
     * @param {InviteUpsertArgs} args - Arguments to update or create a Invite.
     * @example
     * // Update or create a Invite
     * const invite = await prisma.invite.upsert({
     *   create: {
     *     // ... data to create a Invite
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Invite we want to update
     *   }
     * })
     */
    upsert<T extends InviteUpsertArgs>(args: SelectSubset<T, InviteUpsertArgs<ExtArgs>>): Prisma__InviteClient<$Result.GetResult<Prisma.$InvitePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Invites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InviteCountArgs} args - Arguments to filter Invites to count.
     * @example
     * // Count the number of Invites
     * const count = await prisma.invite.count({
     *   where: {
     *     // ... the filter for the Invites we want to count
     *   }
     * })
    **/
    count<T extends InviteCountArgs>(
      args?: Subset<T, InviteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InviteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Invite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InviteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InviteAggregateArgs>(args: Subset<T, InviteAggregateArgs>): Prisma.PrismaPromise<GetInviteAggregateType<T>>

    /**
     * Group by Invite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InviteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InviteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InviteGroupByArgs['orderBy'] }
        : { orderBy?: InviteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InviteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInviteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Invite model
   */
  readonly fields: InviteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Invite.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InviteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    chama<T extends ChamaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChamaDefaultArgs<ExtArgs>>): Prisma__ChamaClient<$Result.GetResult<Prisma.$ChamaPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Invite model
   */ 
  interface InviteFieldRefs {
    readonly id: FieldRef<"Invite", 'String'>
    readonly chamaId: FieldRef<"Invite", 'String'>
    readonly token: FieldRef<"Invite", 'String'>
    readonly sentToEmail: FieldRef<"Invite", 'String'>
    readonly expiresAt: FieldRef<"Invite", 'DateTime'>
    readonly usedAt: FieldRef<"Invite", 'DateTime'>
    readonly createdAt: FieldRef<"Invite", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Invite findUnique
   */
  export type InviteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteInclude<ExtArgs> | null
    /**
     * Filter, which Invite to fetch.
     */
    where: InviteWhereUniqueInput
  }

  /**
   * Invite findUniqueOrThrow
   */
  export type InviteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteInclude<ExtArgs> | null
    /**
     * Filter, which Invite to fetch.
     */
    where: InviteWhereUniqueInput
  }

  /**
   * Invite findFirst
   */
  export type InviteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteInclude<ExtArgs> | null
    /**
     * Filter, which Invite to fetch.
     */
    where?: InviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invites to fetch.
     */
    orderBy?: InviteOrderByWithRelationInput | InviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invites.
     */
    cursor?: InviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invites.
     */
    distinct?: InviteScalarFieldEnum | InviteScalarFieldEnum[]
  }

  /**
   * Invite findFirstOrThrow
   */
  export type InviteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteInclude<ExtArgs> | null
    /**
     * Filter, which Invite to fetch.
     */
    where?: InviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invites to fetch.
     */
    orderBy?: InviteOrderByWithRelationInput | InviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invites.
     */
    cursor?: InviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invites.
     */
    distinct?: InviteScalarFieldEnum | InviteScalarFieldEnum[]
  }

  /**
   * Invite findMany
   */
  export type InviteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteInclude<ExtArgs> | null
    /**
     * Filter, which Invites to fetch.
     */
    where?: InviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invites to fetch.
     */
    orderBy?: InviteOrderByWithRelationInput | InviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Invites.
     */
    cursor?: InviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invites.
     */
    skip?: number
    distinct?: InviteScalarFieldEnum | InviteScalarFieldEnum[]
  }

  /**
   * Invite create
   */
  export type InviteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteInclude<ExtArgs> | null
    /**
     * The data needed to create a Invite.
     */
    data: XOR<InviteCreateInput, InviteUncheckedCreateInput>
  }

  /**
   * Invite createMany
   */
  export type InviteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Invites.
     */
    data: InviteCreateManyInput | InviteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Invite createManyAndReturn
   */
  export type InviteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Invites.
     */
    data: InviteCreateManyInput | InviteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Invite update
   */
  export type InviteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteInclude<ExtArgs> | null
    /**
     * The data needed to update a Invite.
     */
    data: XOR<InviteUpdateInput, InviteUncheckedUpdateInput>
    /**
     * Choose, which Invite to update.
     */
    where: InviteWhereUniqueInput
  }

  /**
   * Invite updateMany
   */
  export type InviteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Invites.
     */
    data: XOR<InviteUpdateManyMutationInput, InviteUncheckedUpdateManyInput>
    /**
     * Filter which Invites to update
     */
    where?: InviteWhereInput
  }

  /**
   * Invite upsert
   */
  export type InviteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteInclude<ExtArgs> | null
    /**
     * The filter to search for the Invite to update in case it exists.
     */
    where: InviteWhereUniqueInput
    /**
     * In case the Invite found by the `where` argument doesn't exist, create a new Invite with this data.
     */
    create: XOR<InviteCreateInput, InviteUncheckedCreateInput>
    /**
     * In case the Invite was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InviteUpdateInput, InviteUncheckedUpdateInput>
  }

  /**
   * Invite delete
   */
  export type InviteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteInclude<ExtArgs> | null
    /**
     * Filter which Invite to delete.
     */
    where: InviteWhereUniqueInput
  }

  /**
   * Invite deleteMany
   */
  export type InviteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invites to delete
     */
    where?: InviteWhereInput
  }

  /**
   * Invite without action
   */
  export type InviteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteInclude<ExtArgs> | null
  }


  /**
   * Model Contribution
   */

  export type AggregateContribution = {
    _count: ContributionCountAggregateOutputType | null
    _avg: ContributionAvgAggregateOutputType | null
    _sum: ContributionSumAggregateOutputType | null
    _min: ContributionMinAggregateOutputType | null
    _max: ContributionMaxAggregateOutputType | null
  }

  export type ContributionAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type ContributionSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type ContributionMinAggregateOutputType = {
    id: string | null
    chamaId: string | null
    userId: string | null
    amount: Decimal | null
    currency: string | null
    status: $Enums.ContributionStatus | null
    date: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ContributionMaxAggregateOutputType = {
    id: string | null
    chamaId: string | null
    userId: string | null
    amount: Decimal | null
    currency: string | null
    status: $Enums.ContributionStatus | null
    date: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ContributionCountAggregateOutputType = {
    id: number
    chamaId: number
    userId: number
    amount: number
    currency: number
    status: number
    date: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ContributionAvgAggregateInputType = {
    amount?: true
  }

  export type ContributionSumAggregateInputType = {
    amount?: true
  }

  export type ContributionMinAggregateInputType = {
    id?: true
    chamaId?: true
    userId?: true
    amount?: true
    currency?: true
    status?: true
    date?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ContributionMaxAggregateInputType = {
    id?: true
    chamaId?: true
    userId?: true
    amount?: true
    currency?: true
    status?: true
    date?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ContributionCountAggregateInputType = {
    id?: true
    chamaId?: true
    userId?: true
    amount?: true
    currency?: true
    status?: true
    date?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ContributionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Contribution to aggregate.
     */
    where?: ContributionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Contributions to fetch.
     */
    orderBy?: ContributionOrderByWithRelationInput | ContributionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ContributionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Contributions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Contributions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Contributions
    **/
    _count?: true | ContributionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ContributionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ContributionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ContributionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ContributionMaxAggregateInputType
  }

  export type GetContributionAggregateType<T extends ContributionAggregateArgs> = {
        [P in keyof T & keyof AggregateContribution]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContribution[P]>
      : GetScalarType<T[P], AggregateContribution[P]>
  }




  export type ContributionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContributionWhereInput
    orderBy?: ContributionOrderByWithAggregationInput | ContributionOrderByWithAggregationInput[]
    by: ContributionScalarFieldEnum[] | ContributionScalarFieldEnum
    having?: ContributionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ContributionCountAggregateInputType | true
    _avg?: ContributionAvgAggregateInputType
    _sum?: ContributionSumAggregateInputType
    _min?: ContributionMinAggregateInputType
    _max?: ContributionMaxAggregateInputType
  }

  export type ContributionGroupByOutputType = {
    id: string
    chamaId: string
    userId: string
    amount: Decimal
    currency: string
    status: $Enums.ContributionStatus
    date: Date
    createdAt: Date
    updatedAt: Date
    _count: ContributionCountAggregateOutputType | null
    _avg: ContributionAvgAggregateOutputType | null
    _sum: ContributionSumAggregateOutputType | null
    _min: ContributionMinAggregateOutputType | null
    _max: ContributionMaxAggregateOutputType | null
  }

  type GetContributionGroupByPayload<T extends ContributionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ContributionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ContributionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ContributionGroupByOutputType[P]>
            : GetScalarType<T[P], ContributionGroupByOutputType[P]>
        }
      >
    >


  export type ContributionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chamaId?: boolean
    userId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    date?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    chama?: boolean | ChamaDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    payments?: boolean | Contribution$paymentsArgs<ExtArgs>
    _count?: boolean | ContributionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contribution"]>

  export type ContributionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chamaId?: boolean
    userId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    date?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    chama?: boolean | ChamaDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contribution"]>

  export type ContributionSelectScalar = {
    id?: boolean
    chamaId?: boolean
    userId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    date?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ContributionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chama?: boolean | ChamaDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    payments?: boolean | Contribution$paymentsArgs<ExtArgs>
    _count?: boolean | ContributionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ContributionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chama?: boolean | ChamaDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ContributionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Contribution"
    objects: {
      chama: Prisma.$ChamaPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
      payments: Prisma.$PaymentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      chamaId: string
      userId: string
      amount: Prisma.Decimal
      currency: string
      status: $Enums.ContributionStatus
      date: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["contribution"]>
    composites: {}
  }

  type ContributionGetPayload<S extends boolean | null | undefined | ContributionDefaultArgs> = $Result.GetResult<Prisma.$ContributionPayload, S>

  type ContributionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ContributionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ContributionCountAggregateInputType | true
    }

  export interface ContributionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Contribution'], meta: { name: 'Contribution' } }
    /**
     * Find zero or one Contribution that matches the filter.
     * @param {ContributionFindUniqueArgs} args - Arguments to find a Contribution
     * @example
     * // Get one Contribution
     * const contribution = await prisma.contribution.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ContributionFindUniqueArgs>(args: SelectSubset<T, ContributionFindUniqueArgs<ExtArgs>>): Prisma__ContributionClient<$Result.GetResult<Prisma.$ContributionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Contribution that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ContributionFindUniqueOrThrowArgs} args - Arguments to find a Contribution
     * @example
     * // Get one Contribution
     * const contribution = await prisma.contribution.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ContributionFindUniqueOrThrowArgs>(args: SelectSubset<T, ContributionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ContributionClient<$Result.GetResult<Prisma.$ContributionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Contribution that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContributionFindFirstArgs} args - Arguments to find a Contribution
     * @example
     * // Get one Contribution
     * const contribution = await prisma.contribution.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ContributionFindFirstArgs>(args?: SelectSubset<T, ContributionFindFirstArgs<ExtArgs>>): Prisma__ContributionClient<$Result.GetResult<Prisma.$ContributionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Contribution that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContributionFindFirstOrThrowArgs} args - Arguments to find a Contribution
     * @example
     * // Get one Contribution
     * const contribution = await prisma.contribution.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ContributionFindFirstOrThrowArgs>(args?: SelectSubset<T, ContributionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ContributionClient<$Result.GetResult<Prisma.$ContributionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Contributions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContributionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Contributions
     * const contributions = await prisma.contribution.findMany()
     * 
     * // Get first 10 Contributions
     * const contributions = await prisma.contribution.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const contributionWithIdOnly = await prisma.contribution.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ContributionFindManyArgs>(args?: SelectSubset<T, ContributionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContributionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Contribution.
     * @param {ContributionCreateArgs} args - Arguments to create a Contribution.
     * @example
     * // Create one Contribution
     * const Contribution = await prisma.contribution.create({
     *   data: {
     *     // ... data to create a Contribution
     *   }
     * })
     * 
     */
    create<T extends ContributionCreateArgs>(args: SelectSubset<T, ContributionCreateArgs<ExtArgs>>): Prisma__ContributionClient<$Result.GetResult<Prisma.$ContributionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Contributions.
     * @param {ContributionCreateManyArgs} args - Arguments to create many Contributions.
     * @example
     * // Create many Contributions
     * const contribution = await prisma.contribution.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ContributionCreateManyArgs>(args?: SelectSubset<T, ContributionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Contributions and returns the data saved in the database.
     * @param {ContributionCreateManyAndReturnArgs} args - Arguments to create many Contributions.
     * @example
     * // Create many Contributions
     * const contribution = await prisma.contribution.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Contributions and only return the `id`
     * const contributionWithIdOnly = await prisma.contribution.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ContributionCreateManyAndReturnArgs>(args?: SelectSubset<T, ContributionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContributionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Contribution.
     * @param {ContributionDeleteArgs} args - Arguments to delete one Contribution.
     * @example
     * // Delete one Contribution
     * const Contribution = await prisma.contribution.delete({
     *   where: {
     *     // ... filter to delete one Contribution
     *   }
     * })
     * 
     */
    delete<T extends ContributionDeleteArgs>(args: SelectSubset<T, ContributionDeleteArgs<ExtArgs>>): Prisma__ContributionClient<$Result.GetResult<Prisma.$ContributionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Contribution.
     * @param {ContributionUpdateArgs} args - Arguments to update one Contribution.
     * @example
     * // Update one Contribution
     * const contribution = await prisma.contribution.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ContributionUpdateArgs>(args: SelectSubset<T, ContributionUpdateArgs<ExtArgs>>): Prisma__ContributionClient<$Result.GetResult<Prisma.$ContributionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Contributions.
     * @param {ContributionDeleteManyArgs} args - Arguments to filter Contributions to delete.
     * @example
     * // Delete a few Contributions
     * const { count } = await prisma.contribution.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ContributionDeleteManyArgs>(args?: SelectSubset<T, ContributionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Contributions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContributionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Contributions
     * const contribution = await prisma.contribution.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ContributionUpdateManyArgs>(args: SelectSubset<T, ContributionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Contribution.
     * @param {ContributionUpsertArgs} args - Arguments to update or create a Contribution.
     * @example
     * // Update or create a Contribution
     * const contribution = await prisma.contribution.upsert({
     *   create: {
     *     // ... data to create a Contribution
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Contribution we want to update
     *   }
     * })
     */
    upsert<T extends ContributionUpsertArgs>(args: SelectSubset<T, ContributionUpsertArgs<ExtArgs>>): Prisma__ContributionClient<$Result.GetResult<Prisma.$ContributionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Contributions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContributionCountArgs} args - Arguments to filter Contributions to count.
     * @example
     * // Count the number of Contributions
     * const count = await prisma.contribution.count({
     *   where: {
     *     // ... the filter for the Contributions we want to count
     *   }
     * })
    **/
    count<T extends ContributionCountArgs>(
      args?: Subset<T, ContributionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ContributionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Contribution.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContributionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ContributionAggregateArgs>(args: Subset<T, ContributionAggregateArgs>): Prisma.PrismaPromise<GetContributionAggregateType<T>>

    /**
     * Group by Contribution.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContributionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ContributionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ContributionGroupByArgs['orderBy'] }
        : { orderBy?: ContributionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ContributionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContributionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Contribution model
   */
  readonly fields: ContributionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Contribution.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ContributionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    chama<T extends ChamaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChamaDefaultArgs<ExtArgs>>): Prisma__ChamaClient<$Result.GetResult<Prisma.$ChamaPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    payments<T extends Contribution$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, Contribution$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Contribution model
   */ 
  interface ContributionFieldRefs {
    readonly id: FieldRef<"Contribution", 'String'>
    readonly chamaId: FieldRef<"Contribution", 'String'>
    readonly userId: FieldRef<"Contribution", 'String'>
    readonly amount: FieldRef<"Contribution", 'Decimal'>
    readonly currency: FieldRef<"Contribution", 'String'>
    readonly status: FieldRef<"Contribution", 'ContributionStatus'>
    readonly date: FieldRef<"Contribution", 'DateTime'>
    readonly createdAt: FieldRef<"Contribution", 'DateTime'>
    readonly updatedAt: FieldRef<"Contribution", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Contribution findUnique
   */
  export type ContributionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contribution
     */
    select?: ContributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContributionInclude<ExtArgs> | null
    /**
     * Filter, which Contribution to fetch.
     */
    where: ContributionWhereUniqueInput
  }

  /**
   * Contribution findUniqueOrThrow
   */
  export type ContributionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contribution
     */
    select?: ContributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContributionInclude<ExtArgs> | null
    /**
     * Filter, which Contribution to fetch.
     */
    where: ContributionWhereUniqueInput
  }

  /**
   * Contribution findFirst
   */
  export type ContributionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contribution
     */
    select?: ContributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContributionInclude<ExtArgs> | null
    /**
     * Filter, which Contribution to fetch.
     */
    where?: ContributionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Contributions to fetch.
     */
    orderBy?: ContributionOrderByWithRelationInput | ContributionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Contributions.
     */
    cursor?: ContributionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Contributions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Contributions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Contributions.
     */
    distinct?: ContributionScalarFieldEnum | ContributionScalarFieldEnum[]
  }

  /**
   * Contribution findFirstOrThrow
   */
  export type ContributionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contribution
     */
    select?: ContributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContributionInclude<ExtArgs> | null
    /**
     * Filter, which Contribution to fetch.
     */
    where?: ContributionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Contributions to fetch.
     */
    orderBy?: ContributionOrderByWithRelationInput | ContributionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Contributions.
     */
    cursor?: ContributionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Contributions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Contributions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Contributions.
     */
    distinct?: ContributionScalarFieldEnum | ContributionScalarFieldEnum[]
  }

  /**
   * Contribution findMany
   */
  export type ContributionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contribution
     */
    select?: ContributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContributionInclude<ExtArgs> | null
    /**
     * Filter, which Contributions to fetch.
     */
    where?: ContributionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Contributions to fetch.
     */
    orderBy?: ContributionOrderByWithRelationInput | ContributionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Contributions.
     */
    cursor?: ContributionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Contributions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Contributions.
     */
    skip?: number
    distinct?: ContributionScalarFieldEnum | ContributionScalarFieldEnum[]
  }

  /**
   * Contribution create
   */
  export type ContributionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contribution
     */
    select?: ContributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContributionInclude<ExtArgs> | null
    /**
     * The data needed to create a Contribution.
     */
    data: XOR<ContributionCreateInput, ContributionUncheckedCreateInput>
  }

  /**
   * Contribution createMany
   */
  export type ContributionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Contributions.
     */
    data: ContributionCreateManyInput | ContributionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Contribution createManyAndReturn
   */
  export type ContributionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contribution
     */
    select?: ContributionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Contributions.
     */
    data: ContributionCreateManyInput | ContributionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContributionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Contribution update
   */
  export type ContributionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contribution
     */
    select?: ContributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContributionInclude<ExtArgs> | null
    /**
     * The data needed to update a Contribution.
     */
    data: XOR<ContributionUpdateInput, ContributionUncheckedUpdateInput>
    /**
     * Choose, which Contribution to update.
     */
    where: ContributionWhereUniqueInput
  }

  /**
   * Contribution updateMany
   */
  export type ContributionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Contributions.
     */
    data: XOR<ContributionUpdateManyMutationInput, ContributionUncheckedUpdateManyInput>
    /**
     * Filter which Contributions to update
     */
    where?: ContributionWhereInput
  }

  /**
   * Contribution upsert
   */
  export type ContributionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contribution
     */
    select?: ContributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContributionInclude<ExtArgs> | null
    /**
     * The filter to search for the Contribution to update in case it exists.
     */
    where: ContributionWhereUniqueInput
    /**
     * In case the Contribution found by the `where` argument doesn't exist, create a new Contribution with this data.
     */
    create: XOR<ContributionCreateInput, ContributionUncheckedCreateInput>
    /**
     * In case the Contribution was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ContributionUpdateInput, ContributionUncheckedUpdateInput>
  }

  /**
   * Contribution delete
   */
  export type ContributionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contribution
     */
    select?: ContributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContributionInclude<ExtArgs> | null
    /**
     * Filter which Contribution to delete.
     */
    where: ContributionWhereUniqueInput
  }

  /**
   * Contribution deleteMany
   */
  export type ContributionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Contributions to delete
     */
    where?: ContributionWhereInput
  }

  /**
   * Contribution.payments
   */
  export type Contribution$paymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    cursor?: PaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Contribution without action
   */
  export type ContributionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Contribution
     */
    select?: ContributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContributionInclude<ExtArgs> | null
  }


  /**
   * Model Payment
   */

  export type AggregatePayment = {
    _count: PaymentCountAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  export type PaymentMinAggregateOutputType = {
    id: string | null
    contributionId: string | null
    method: $Enums.PaymentMethod | null
    externalRef: string | null
    status: $Enums.PaymentStatus | null
    processedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PaymentMaxAggregateOutputType = {
    id: string | null
    contributionId: string | null
    method: $Enums.PaymentMethod | null
    externalRef: string | null
    status: $Enums.PaymentStatus | null
    processedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PaymentCountAggregateOutputType = {
    id: number
    contributionId: number
    method: number
    externalRef: number
    status: number
    processedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PaymentMinAggregateInputType = {
    id?: true
    contributionId?: true
    method?: true
    externalRef?: true
    status?: true
    processedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PaymentMaxAggregateInputType = {
    id?: true
    contributionId?: true
    method?: true
    externalRef?: true
    status?: true
    processedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PaymentCountAggregateInputType = {
    id?: true
    contributionId?: true
    method?: true
    externalRef?: true
    status?: true
    processedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payment to aggregate.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Payments
    **/
    _count?: true | PaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentMaxAggregateInputType
  }

  export type GetPaymentAggregateType<T extends PaymentAggregateArgs> = {
        [P in keyof T & keyof AggregatePayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayment[P]>
      : GetScalarType<T[P], AggregatePayment[P]>
  }




  export type PaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithAggregationInput | PaymentOrderByWithAggregationInput[]
    by: PaymentScalarFieldEnum[] | PaymentScalarFieldEnum
    having?: PaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentCountAggregateInputType | true
    _min?: PaymentMinAggregateInputType
    _max?: PaymentMaxAggregateInputType
  }

  export type PaymentGroupByOutputType = {
    id: string
    contributionId: string
    method: $Enums.PaymentMethod
    externalRef: string | null
    status: $Enums.PaymentStatus
    processedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: PaymentCountAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  type GetPaymentGroupByPayload<T extends PaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentGroupByOutputType[P]>
        }
      >
    >


  export type PaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contributionId?: boolean
    method?: boolean
    externalRef?: boolean
    status?: boolean
    processedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    contribution?: boolean | ContributionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contributionId?: boolean
    method?: boolean
    externalRef?: boolean
    status?: boolean
    processedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    contribution?: boolean | ContributionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectScalar = {
    id?: boolean
    contributionId?: boolean
    method?: boolean
    externalRef?: boolean
    status?: boolean
    processedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contribution?: boolean | ContributionDefaultArgs<ExtArgs>
  }
  export type PaymentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contribution?: boolean | ContributionDefaultArgs<ExtArgs>
  }

  export type $PaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Payment"
    objects: {
      contribution: Prisma.$ContributionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      contributionId: string
      method: $Enums.PaymentMethod
      externalRef: string | null
      status: $Enums.PaymentStatus
      processedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["payment"]>
    composites: {}
  }

  type PaymentGetPayload<S extends boolean | null | undefined | PaymentDefaultArgs> = $Result.GetResult<Prisma.$PaymentPayload, S>

  type PaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PaymentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PaymentCountAggregateInputType | true
    }

  export interface PaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Payment'], meta: { name: 'Payment' } }
    /**
     * Find zero or one Payment that matches the filter.
     * @param {PaymentFindUniqueArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentFindUniqueArgs>(args: SelectSubset<T, PaymentFindUniqueArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Payment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PaymentFindUniqueOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Payment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentFindFirstArgs>(args?: SelectSubset<T, PaymentFindFirstArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Payment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Payments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payments
     * const payments = await prisma.payment.findMany()
     * 
     * // Get first 10 Payments
     * const payments = await prisma.payment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentWithIdOnly = await prisma.payment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentFindManyArgs>(args?: SelectSubset<T, PaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Payment.
     * @param {PaymentCreateArgs} args - Arguments to create a Payment.
     * @example
     * // Create one Payment
     * const Payment = await prisma.payment.create({
     *   data: {
     *     // ... data to create a Payment
     *   }
     * })
     * 
     */
    create<T extends PaymentCreateArgs>(args: SelectSubset<T, PaymentCreateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Payments.
     * @param {PaymentCreateManyArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentCreateManyArgs>(args?: SelectSubset<T, PaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Payments and returns the data saved in the database.
     * @param {PaymentCreateManyAndReturnArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Payment.
     * @param {PaymentDeleteArgs} args - Arguments to delete one Payment.
     * @example
     * // Delete one Payment
     * const Payment = await prisma.payment.delete({
     *   where: {
     *     // ... filter to delete one Payment
     *   }
     * })
     * 
     */
    delete<T extends PaymentDeleteArgs>(args: SelectSubset<T, PaymentDeleteArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Payment.
     * @param {PaymentUpdateArgs} args - Arguments to update one Payment.
     * @example
     * // Update one Payment
     * const payment = await prisma.payment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentUpdateArgs>(args: SelectSubset<T, PaymentUpdateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Payments.
     * @param {PaymentDeleteManyArgs} args - Arguments to filter Payments to delete.
     * @example
     * // Delete a few Payments
     * const { count } = await prisma.payment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentDeleteManyArgs>(args?: SelectSubset<T, PaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentUpdateManyArgs>(args: SelectSubset<T, PaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Payment.
     * @param {PaymentUpsertArgs} args - Arguments to update or create a Payment.
     * @example
     * // Update or create a Payment
     * const payment = await prisma.payment.upsert({
     *   create: {
     *     // ... data to create a Payment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payment we want to update
     *   }
     * })
     */
    upsert<T extends PaymentUpsertArgs>(args: SelectSubset<T, PaymentUpsertArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCountArgs} args - Arguments to filter Payments to count.
     * @example
     * // Count the number of Payments
     * const count = await prisma.payment.count({
     *   where: {
     *     // ... the filter for the Payments we want to count
     *   }
     * })
    **/
    count<T extends PaymentCountArgs>(
      args?: Subset<T, PaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentAggregateArgs>(args: Subset<T, PaymentAggregateArgs>): Prisma.PrismaPromise<GetPaymentAggregateType<T>>

    /**
     * Group by Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentGroupByArgs['orderBy'] }
        : { orderBy?: PaymentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Payment model
   */
  readonly fields: PaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Payment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    contribution<T extends ContributionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ContributionDefaultArgs<ExtArgs>>): Prisma__ContributionClient<$Result.GetResult<Prisma.$ContributionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Payment model
   */ 
  interface PaymentFieldRefs {
    readonly id: FieldRef<"Payment", 'String'>
    readonly contributionId: FieldRef<"Payment", 'String'>
    readonly method: FieldRef<"Payment", 'PaymentMethod'>
    readonly externalRef: FieldRef<"Payment", 'String'>
    readonly status: FieldRef<"Payment", 'PaymentStatus'>
    readonly processedAt: FieldRef<"Payment", 'DateTime'>
    readonly createdAt: FieldRef<"Payment", 'DateTime'>
    readonly updatedAt: FieldRef<"Payment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Payment findUnique
   */
  export type PaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findUniqueOrThrow
   */
  export type PaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findFirst
   */
  export type PaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findFirstOrThrow
   */
  export type PaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findMany
   */
  export type PaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payments to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment create
   */
  export type PaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a Payment.
     */
    data: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
  }

  /**
   * Payment createMany
   */
  export type PaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Payment createManyAndReturn
   */
  export type PaymentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment update
   */
  export type PaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a Payment.
     */
    data: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
    /**
     * Choose, which Payment to update.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment updateMany
   */
  export type PaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
  }

  /**
   * Payment upsert
   */
  export type PaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the Payment to update in case it exists.
     */
    where: PaymentWhereUniqueInput
    /**
     * In case the Payment found by the `where` argument doesn't exist, create a new Payment with this data.
     */
    create: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
    /**
     * In case the Payment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
  }

  /**
   * Payment delete
   */
  export type PaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter which Payment to delete.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment deleteMany
   */
  export type PaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payments to delete
     */
    where?: PaymentWhereInput
  }

  /**
   * Payment without action
   */
  export type PaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
  }


  /**
   * Model NotificationType
   */

  export type AggregateNotificationType = {
    _count: NotificationTypeCountAggregateOutputType | null
    _avg: NotificationTypeAvgAggregateOutputType | null
    _sum: NotificationTypeSumAggregateOutputType | null
    _min: NotificationTypeMinAggregateOutputType | null
    _max: NotificationTypeMaxAggregateOutputType | null
  }

  export type NotificationTypeAvgAggregateOutputType = {
    id: number | null
  }

  export type NotificationTypeSumAggregateOutputType = {
    id: number | null
  }

  export type NotificationTypeMinAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    defaultDelivery: $Enums.DeliveryMethod | null
  }

  export type NotificationTypeMaxAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    defaultDelivery: $Enums.DeliveryMethod | null
  }

  export type NotificationTypeCountAggregateOutputType = {
    id: number
    name: number
    description: number
    defaultDelivery: number
    _all: number
  }


  export type NotificationTypeAvgAggregateInputType = {
    id?: true
  }

  export type NotificationTypeSumAggregateInputType = {
    id?: true
  }

  export type NotificationTypeMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    defaultDelivery?: true
  }

  export type NotificationTypeMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    defaultDelivery?: true
  }

  export type NotificationTypeCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    defaultDelivery?: true
    _all?: true
  }

  export type NotificationTypeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationType to aggregate.
     */
    where?: NotificationTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationTypes to fetch.
     */
    orderBy?: NotificationTypeOrderByWithRelationInput | NotificationTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NotificationTypes
    **/
    _count?: true | NotificationTypeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NotificationTypeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NotificationTypeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationTypeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationTypeMaxAggregateInputType
  }

  export type GetNotificationTypeAggregateType<T extends NotificationTypeAggregateArgs> = {
        [P in keyof T & keyof AggregateNotificationType]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotificationType[P]>
      : GetScalarType<T[P], AggregateNotificationType[P]>
  }




  export type NotificationTypeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationTypeWhereInput
    orderBy?: NotificationTypeOrderByWithAggregationInput | NotificationTypeOrderByWithAggregationInput[]
    by: NotificationTypeScalarFieldEnum[] | NotificationTypeScalarFieldEnum
    having?: NotificationTypeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationTypeCountAggregateInputType | true
    _avg?: NotificationTypeAvgAggregateInputType
    _sum?: NotificationTypeSumAggregateInputType
    _min?: NotificationTypeMinAggregateInputType
    _max?: NotificationTypeMaxAggregateInputType
  }

  export type NotificationTypeGroupByOutputType = {
    id: number
    name: string
    description: string | null
    defaultDelivery: $Enums.DeliveryMethod
    _count: NotificationTypeCountAggregateOutputType | null
    _avg: NotificationTypeAvgAggregateOutputType | null
    _sum: NotificationTypeSumAggregateOutputType | null
    _min: NotificationTypeMinAggregateOutputType | null
    _max: NotificationTypeMaxAggregateOutputType | null
  }

  type GetNotificationTypeGroupByPayload<T extends NotificationTypeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationTypeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationTypeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationTypeGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationTypeGroupByOutputType[P]>
        }
      >
    >


  export type NotificationTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    defaultDelivery?: boolean
    notifications?: boolean | NotificationType$notificationsArgs<ExtArgs>
    _count?: boolean | NotificationTypeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notificationType"]>

  export type NotificationTypeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    defaultDelivery?: boolean
  }, ExtArgs["result"]["notificationType"]>

  export type NotificationTypeSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    defaultDelivery?: boolean
  }

  export type NotificationTypeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    notifications?: boolean | NotificationType$notificationsArgs<ExtArgs>
    _count?: boolean | NotificationTypeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type NotificationTypeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $NotificationTypePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NotificationType"
    objects: {
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      description: string | null
      defaultDelivery: $Enums.DeliveryMethod
    }, ExtArgs["result"]["notificationType"]>
    composites: {}
  }

  type NotificationTypeGetPayload<S extends boolean | null | undefined | NotificationTypeDefaultArgs> = $Result.GetResult<Prisma.$NotificationTypePayload, S>

  type NotificationTypeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NotificationTypeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NotificationTypeCountAggregateInputType | true
    }

  export interface NotificationTypeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NotificationType'], meta: { name: 'NotificationType' } }
    /**
     * Find zero or one NotificationType that matches the filter.
     * @param {NotificationTypeFindUniqueArgs} args - Arguments to find a NotificationType
     * @example
     * // Get one NotificationType
     * const notificationType = await prisma.notificationType.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationTypeFindUniqueArgs>(args: SelectSubset<T, NotificationTypeFindUniqueArgs<ExtArgs>>): Prisma__NotificationTypeClient<$Result.GetResult<Prisma.$NotificationTypePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one NotificationType that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NotificationTypeFindUniqueOrThrowArgs} args - Arguments to find a NotificationType
     * @example
     * // Get one NotificationType
     * const notificationType = await prisma.notificationType.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationTypeFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationTypeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationTypeClient<$Result.GetResult<Prisma.$NotificationTypePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first NotificationType that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationTypeFindFirstArgs} args - Arguments to find a NotificationType
     * @example
     * // Get one NotificationType
     * const notificationType = await prisma.notificationType.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationTypeFindFirstArgs>(args?: SelectSubset<T, NotificationTypeFindFirstArgs<ExtArgs>>): Prisma__NotificationTypeClient<$Result.GetResult<Prisma.$NotificationTypePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first NotificationType that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationTypeFindFirstOrThrowArgs} args - Arguments to find a NotificationType
     * @example
     * // Get one NotificationType
     * const notificationType = await prisma.notificationType.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationTypeFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationTypeFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationTypeClient<$Result.GetResult<Prisma.$NotificationTypePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more NotificationTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationTypeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NotificationTypes
     * const notificationTypes = await prisma.notificationType.findMany()
     * 
     * // Get first 10 NotificationTypes
     * const notificationTypes = await prisma.notificationType.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationTypeWithIdOnly = await prisma.notificationType.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationTypeFindManyArgs>(args?: SelectSubset<T, NotificationTypeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationTypePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a NotificationType.
     * @param {NotificationTypeCreateArgs} args - Arguments to create a NotificationType.
     * @example
     * // Create one NotificationType
     * const NotificationType = await prisma.notificationType.create({
     *   data: {
     *     // ... data to create a NotificationType
     *   }
     * })
     * 
     */
    create<T extends NotificationTypeCreateArgs>(args: SelectSubset<T, NotificationTypeCreateArgs<ExtArgs>>): Prisma__NotificationTypeClient<$Result.GetResult<Prisma.$NotificationTypePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many NotificationTypes.
     * @param {NotificationTypeCreateManyArgs} args - Arguments to create many NotificationTypes.
     * @example
     * // Create many NotificationTypes
     * const notificationType = await prisma.notificationType.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationTypeCreateManyArgs>(args?: SelectSubset<T, NotificationTypeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NotificationTypes and returns the data saved in the database.
     * @param {NotificationTypeCreateManyAndReturnArgs} args - Arguments to create many NotificationTypes.
     * @example
     * // Create many NotificationTypes
     * const notificationType = await prisma.notificationType.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NotificationTypes and only return the `id`
     * const notificationTypeWithIdOnly = await prisma.notificationType.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationTypeCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationTypeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationTypePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a NotificationType.
     * @param {NotificationTypeDeleteArgs} args - Arguments to delete one NotificationType.
     * @example
     * // Delete one NotificationType
     * const NotificationType = await prisma.notificationType.delete({
     *   where: {
     *     // ... filter to delete one NotificationType
     *   }
     * })
     * 
     */
    delete<T extends NotificationTypeDeleteArgs>(args: SelectSubset<T, NotificationTypeDeleteArgs<ExtArgs>>): Prisma__NotificationTypeClient<$Result.GetResult<Prisma.$NotificationTypePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one NotificationType.
     * @param {NotificationTypeUpdateArgs} args - Arguments to update one NotificationType.
     * @example
     * // Update one NotificationType
     * const notificationType = await prisma.notificationType.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationTypeUpdateArgs>(args: SelectSubset<T, NotificationTypeUpdateArgs<ExtArgs>>): Prisma__NotificationTypeClient<$Result.GetResult<Prisma.$NotificationTypePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more NotificationTypes.
     * @param {NotificationTypeDeleteManyArgs} args - Arguments to filter NotificationTypes to delete.
     * @example
     * // Delete a few NotificationTypes
     * const { count } = await prisma.notificationType.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationTypeDeleteManyArgs>(args?: SelectSubset<T, NotificationTypeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NotificationTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationTypeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NotificationTypes
     * const notificationType = await prisma.notificationType.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationTypeUpdateManyArgs>(args: SelectSubset<T, NotificationTypeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one NotificationType.
     * @param {NotificationTypeUpsertArgs} args - Arguments to update or create a NotificationType.
     * @example
     * // Update or create a NotificationType
     * const notificationType = await prisma.notificationType.upsert({
     *   create: {
     *     // ... data to create a NotificationType
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NotificationType we want to update
     *   }
     * })
     */
    upsert<T extends NotificationTypeUpsertArgs>(args: SelectSubset<T, NotificationTypeUpsertArgs<ExtArgs>>): Prisma__NotificationTypeClient<$Result.GetResult<Prisma.$NotificationTypePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of NotificationTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationTypeCountArgs} args - Arguments to filter NotificationTypes to count.
     * @example
     * // Count the number of NotificationTypes
     * const count = await prisma.notificationType.count({
     *   where: {
     *     // ... the filter for the NotificationTypes we want to count
     *   }
     * })
    **/
    count<T extends NotificationTypeCountArgs>(
      args?: Subset<T, NotificationTypeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationTypeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NotificationType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationTypeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationTypeAggregateArgs>(args: Subset<T, NotificationTypeAggregateArgs>): Prisma.PrismaPromise<GetNotificationTypeAggregateType<T>>

    /**
     * Group by NotificationType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationTypeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationTypeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationTypeGroupByArgs['orderBy'] }
        : { orderBy?: NotificationTypeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationTypeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationTypeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NotificationType model
   */
  readonly fields: NotificationTypeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NotificationType.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationTypeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    notifications<T extends NotificationType$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, NotificationType$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NotificationType model
   */ 
  interface NotificationTypeFieldRefs {
    readonly id: FieldRef<"NotificationType", 'Int'>
    readonly name: FieldRef<"NotificationType", 'String'>
    readonly description: FieldRef<"NotificationType", 'String'>
    readonly defaultDelivery: FieldRef<"NotificationType", 'DeliveryMethod'>
  }
    

  // Custom InputTypes
  /**
   * NotificationType findUnique
   */
  export type NotificationTypeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationType
     */
    select?: NotificationTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationTypeInclude<ExtArgs> | null
    /**
     * Filter, which NotificationType to fetch.
     */
    where: NotificationTypeWhereUniqueInput
  }

  /**
   * NotificationType findUniqueOrThrow
   */
  export type NotificationTypeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationType
     */
    select?: NotificationTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationTypeInclude<ExtArgs> | null
    /**
     * Filter, which NotificationType to fetch.
     */
    where: NotificationTypeWhereUniqueInput
  }

  /**
   * NotificationType findFirst
   */
  export type NotificationTypeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationType
     */
    select?: NotificationTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationTypeInclude<ExtArgs> | null
    /**
     * Filter, which NotificationType to fetch.
     */
    where?: NotificationTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationTypes to fetch.
     */
    orderBy?: NotificationTypeOrderByWithRelationInput | NotificationTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationTypes.
     */
    cursor?: NotificationTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationTypes.
     */
    distinct?: NotificationTypeScalarFieldEnum | NotificationTypeScalarFieldEnum[]
  }

  /**
   * NotificationType findFirstOrThrow
   */
  export type NotificationTypeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationType
     */
    select?: NotificationTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationTypeInclude<ExtArgs> | null
    /**
     * Filter, which NotificationType to fetch.
     */
    where?: NotificationTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationTypes to fetch.
     */
    orderBy?: NotificationTypeOrderByWithRelationInput | NotificationTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationTypes.
     */
    cursor?: NotificationTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationTypes.
     */
    distinct?: NotificationTypeScalarFieldEnum | NotificationTypeScalarFieldEnum[]
  }

  /**
   * NotificationType findMany
   */
  export type NotificationTypeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationType
     */
    select?: NotificationTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationTypeInclude<ExtArgs> | null
    /**
     * Filter, which NotificationTypes to fetch.
     */
    where?: NotificationTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationTypes to fetch.
     */
    orderBy?: NotificationTypeOrderByWithRelationInput | NotificationTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NotificationTypes.
     */
    cursor?: NotificationTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationTypes.
     */
    skip?: number
    distinct?: NotificationTypeScalarFieldEnum | NotificationTypeScalarFieldEnum[]
  }

  /**
   * NotificationType create
   */
  export type NotificationTypeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationType
     */
    select?: NotificationTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationTypeInclude<ExtArgs> | null
    /**
     * The data needed to create a NotificationType.
     */
    data: XOR<NotificationTypeCreateInput, NotificationTypeUncheckedCreateInput>
  }

  /**
   * NotificationType createMany
   */
  export type NotificationTypeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NotificationTypes.
     */
    data: NotificationTypeCreateManyInput | NotificationTypeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NotificationType createManyAndReturn
   */
  export type NotificationTypeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationType
     */
    select?: NotificationTypeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many NotificationTypes.
     */
    data: NotificationTypeCreateManyInput | NotificationTypeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NotificationType update
   */
  export type NotificationTypeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationType
     */
    select?: NotificationTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationTypeInclude<ExtArgs> | null
    /**
     * The data needed to update a NotificationType.
     */
    data: XOR<NotificationTypeUpdateInput, NotificationTypeUncheckedUpdateInput>
    /**
     * Choose, which NotificationType to update.
     */
    where: NotificationTypeWhereUniqueInput
  }

  /**
   * NotificationType updateMany
   */
  export type NotificationTypeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NotificationTypes.
     */
    data: XOR<NotificationTypeUpdateManyMutationInput, NotificationTypeUncheckedUpdateManyInput>
    /**
     * Filter which NotificationTypes to update
     */
    where?: NotificationTypeWhereInput
  }

  /**
   * NotificationType upsert
   */
  export type NotificationTypeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationType
     */
    select?: NotificationTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationTypeInclude<ExtArgs> | null
    /**
     * The filter to search for the NotificationType to update in case it exists.
     */
    where: NotificationTypeWhereUniqueInput
    /**
     * In case the NotificationType found by the `where` argument doesn't exist, create a new NotificationType with this data.
     */
    create: XOR<NotificationTypeCreateInput, NotificationTypeUncheckedCreateInput>
    /**
     * In case the NotificationType was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationTypeUpdateInput, NotificationTypeUncheckedUpdateInput>
  }

  /**
   * NotificationType delete
   */
  export type NotificationTypeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationType
     */
    select?: NotificationTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationTypeInclude<ExtArgs> | null
    /**
     * Filter which NotificationType to delete.
     */
    where: NotificationTypeWhereUniqueInput
  }

  /**
   * NotificationType deleteMany
   */
  export type NotificationTypeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationTypes to delete
     */
    where?: NotificationTypeWhereInput
  }

  /**
   * NotificationType.notifications
   */
  export type NotificationType$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * NotificationType without action
   */
  export type NotificationTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationType
     */
    select?: NotificationTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationTypeInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _avg: NotificationAvgAggregateOutputType | null
    _sum: NotificationSumAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationAvgAggregateOutputType = {
    typeId: number | null
  }

  export type NotificationSumAggregateOutputType = {
    typeId: number | null
  }

  export type NotificationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    typeId: number | null
    title: string | null
    body: string | null
    readAt: Date | null
    sentAt: Date | null
    createdAt: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    typeId: number | null
    title: string | null
    body: string | null
    readAt: Date | null
    sentAt: Date | null
    createdAt: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    userId: number
    typeId: number
    title: number
    body: number
    readAt: number
    sentAt: number
    createdAt: number
    _all: number
  }


  export type NotificationAvgAggregateInputType = {
    typeId?: true
  }

  export type NotificationSumAggregateInputType = {
    typeId?: true
  }

  export type NotificationMinAggregateInputType = {
    id?: true
    userId?: true
    typeId?: true
    title?: true
    body?: true
    readAt?: true
    sentAt?: true
    createdAt?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    userId?: true
    typeId?: true
    title?: true
    body?: true
    readAt?: true
    sentAt?: true
    createdAt?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    userId?: true
    typeId?: true
    title?: true
    body?: true
    readAt?: true
    sentAt?: true
    createdAt?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NotificationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NotificationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _avg?: NotificationAvgAggregateInputType
    _sum?: NotificationSumAggregateInputType
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: string
    userId: string
    typeId: number
    title: string
    body: string
    readAt: Date | null
    sentAt: Date | null
    createdAt: Date
    _count: NotificationCountAggregateOutputType | null
    _avg: NotificationAvgAggregateOutputType | null
    _sum: NotificationSumAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    typeId?: boolean
    title?: boolean
    body?: boolean
    readAt?: boolean
    sentAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    type?: boolean | NotificationTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    typeId?: boolean
    title?: boolean
    body?: boolean
    readAt?: boolean
    sentAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    type?: boolean | NotificationTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    id?: boolean
    userId?: boolean
    typeId?: boolean
    title?: boolean
    body?: boolean
    readAt?: boolean
    sentAt?: boolean
    createdAt?: boolean
  }

  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    type?: boolean | NotificationTypeDefaultArgs<ExtArgs>
  }
  export type NotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    type?: boolean | NotificationTypeDefaultArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      type: Prisma.$NotificationTypePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      typeId: number
      title: string
      body: string
      readAt: Date | null
      sentAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    type<T extends NotificationTypeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, NotificationTypeDefaultArgs<ExtArgs>>): Prisma__NotificationTypeClient<$Result.GetResult<Prisma.$NotificationTypePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */ 
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'String'>
    readonly userId: FieldRef<"Notification", 'String'>
    readonly typeId: FieldRef<"Notification", 'Int'>
    readonly title: FieldRef<"Notification", 'String'>
    readonly body: FieldRef<"Notification", 'String'>
    readonly readAt: FieldRef<"Notification", 'DateTime'>
    readonly sentAt: FieldRef<"Notification", 'DateTime'>
    readonly createdAt: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Model UiSettings
   */

  export type AggregateUiSettings = {
    _count: UiSettingsCountAggregateOutputType | null
    _min: UiSettingsMinAggregateOutputType | null
    _max: UiSettingsMaxAggregateOutputType | null
  }

  export type UiSettingsMinAggregateOutputType = {
    userId: string | null
    showTutorial: boolean | null
    theme: string | null
  }

  export type UiSettingsMaxAggregateOutputType = {
    userId: string | null
    showTutorial: boolean | null
    theme: string | null
  }

  export type UiSettingsCountAggregateOutputType = {
    userId: number
    showTutorial: number
    theme: number
    lastSeenWidgets: number
    _all: number
  }


  export type UiSettingsMinAggregateInputType = {
    userId?: true
    showTutorial?: true
    theme?: true
  }

  export type UiSettingsMaxAggregateInputType = {
    userId?: true
    showTutorial?: true
    theme?: true
  }

  export type UiSettingsCountAggregateInputType = {
    userId?: true
    showTutorial?: true
    theme?: true
    lastSeenWidgets?: true
    _all?: true
  }

  export type UiSettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UiSettings to aggregate.
     */
    where?: UiSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UiSettings to fetch.
     */
    orderBy?: UiSettingsOrderByWithRelationInput | UiSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UiSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UiSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UiSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UiSettings
    **/
    _count?: true | UiSettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UiSettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UiSettingsMaxAggregateInputType
  }

  export type GetUiSettingsAggregateType<T extends UiSettingsAggregateArgs> = {
        [P in keyof T & keyof AggregateUiSettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUiSettings[P]>
      : GetScalarType<T[P], AggregateUiSettings[P]>
  }




  export type UiSettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UiSettingsWhereInput
    orderBy?: UiSettingsOrderByWithAggregationInput | UiSettingsOrderByWithAggregationInput[]
    by: UiSettingsScalarFieldEnum[] | UiSettingsScalarFieldEnum
    having?: UiSettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UiSettingsCountAggregateInputType | true
    _min?: UiSettingsMinAggregateInputType
    _max?: UiSettingsMaxAggregateInputType
  }

  export type UiSettingsGroupByOutputType = {
    userId: string
    showTutorial: boolean
    theme: string | null
    lastSeenWidgets: JsonValue | null
    _count: UiSettingsCountAggregateOutputType | null
    _min: UiSettingsMinAggregateOutputType | null
    _max: UiSettingsMaxAggregateOutputType | null
  }

  type GetUiSettingsGroupByPayload<T extends UiSettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UiSettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UiSettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UiSettingsGroupByOutputType[P]>
            : GetScalarType<T[P], UiSettingsGroupByOutputType[P]>
        }
      >
    >


  export type UiSettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    showTutorial?: boolean
    theme?: boolean
    lastSeenWidgets?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["uiSettings"]>

  export type UiSettingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    showTutorial?: boolean
    theme?: boolean
    lastSeenWidgets?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["uiSettings"]>

  export type UiSettingsSelectScalar = {
    userId?: boolean
    showTutorial?: boolean
    theme?: boolean
    lastSeenWidgets?: boolean
  }

  export type UiSettingsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UiSettingsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UiSettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UiSettings"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      userId: string
      showTutorial: boolean
      theme: string | null
      lastSeenWidgets: Prisma.JsonValue | null
    }, ExtArgs["result"]["uiSettings"]>
    composites: {}
  }

  type UiSettingsGetPayload<S extends boolean | null | undefined | UiSettingsDefaultArgs> = $Result.GetResult<Prisma.$UiSettingsPayload, S>

  type UiSettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UiSettingsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UiSettingsCountAggregateInputType | true
    }

  export interface UiSettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UiSettings'], meta: { name: 'UiSettings' } }
    /**
     * Find zero or one UiSettings that matches the filter.
     * @param {UiSettingsFindUniqueArgs} args - Arguments to find a UiSettings
     * @example
     * // Get one UiSettings
     * const uiSettings = await prisma.uiSettings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UiSettingsFindUniqueArgs>(args: SelectSubset<T, UiSettingsFindUniqueArgs<ExtArgs>>): Prisma__UiSettingsClient<$Result.GetResult<Prisma.$UiSettingsPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one UiSettings that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UiSettingsFindUniqueOrThrowArgs} args - Arguments to find a UiSettings
     * @example
     * // Get one UiSettings
     * const uiSettings = await prisma.uiSettings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UiSettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, UiSettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UiSettingsClient<$Result.GetResult<Prisma.$UiSettingsPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first UiSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UiSettingsFindFirstArgs} args - Arguments to find a UiSettings
     * @example
     * // Get one UiSettings
     * const uiSettings = await prisma.uiSettings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UiSettingsFindFirstArgs>(args?: SelectSubset<T, UiSettingsFindFirstArgs<ExtArgs>>): Prisma__UiSettingsClient<$Result.GetResult<Prisma.$UiSettingsPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first UiSettings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UiSettingsFindFirstOrThrowArgs} args - Arguments to find a UiSettings
     * @example
     * // Get one UiSettings
     * const uiSettings = await prisma.uiSettings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UiSettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, UiSettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__UiSettingsClient<$Result.GetResult<Prisma.$UiSettingsPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more UiSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UiSettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UiSettings
     * const uiSettings = await prisma.uiSettings.findMany()
     * 
     * // Get first 10 UiSettings
     * const uiSettings = await prisma.uiSettings.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const uiSettingsWithUserIdOnly = await prisma.uiSettings.findMany({ select: { userId: true } })
     * 
     */
    findMany<T extends UiSettingsFindManyArgs>(args?: SelectSubset<T, UiSettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UiSettingsPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a UiSettings.
     * @param {UiSettingsCreateArgs} args - Arguments to create a UiSettings.
     * @example
     * // Create one UiSettings
     * const UiSettings = await prisma.uiSettings.create({
     *   data: {
     *     // ... data to create a UiSettings
     *   }
     * })
     * 
     */
    create<T extends UiSettingsCreateArgs>(args: SelectSubset<T, UiSettingsCreateArgs<ExtArgs>>): Prisma__UiSettingsClient<$Result.GetResult<Prisma.$UiSettingsPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many UiSettings.
     * @param {UiSettingsCreateManyArgs} args - Arguments to create many UiSettings.
     * @example
     * // Create many UiSettings
     * const uiSettings = await prisma.uiSettings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UiSettingsCreateManyArgs>(args?: SelectSubset<T, UiSettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UiSettings and returns the data saved in the database.
     * @param {UiSettingsCreateManyAndReturnArgs} args - Arguments to create many UiSettings.
     * @example
     * // Create many UiSettings
     * const uiSettings = await prisma.uiSettings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UiSettings and only return the `userId`
     * const uiSettingsWithUserIdOnly = await prisma.uiSettings.createManyAndReturn({ 
     *   select: { userId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UiSettingsCreateManyAndReturnArgs>(args?: SelectSubset<T, UiSettingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UiSettingsPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a UiSettings.
     * @param {UiSettingsDeleteArgs} args - Arguments to delete one UiSettings.
     * @example
     * // Delete one UiSettings
     * const UiSettings = await prisma.uiSettings.delete({
     *   where: {
     *     // ... filter to delete one UiSettings
     *   }
     * })
     * 
     */
    delete<T extends UiSettingsDeleteArgs>(args: SelectSubset<T, UiSettingsDeleteArgs<ExtArgs>>): Prisma__UiSettingsClient<$Result.GetResult<Prisma.$UiSettingsPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one UiSettings.
     * @param {UiSettingsUpdateArgs} args - Arguments to update one UiSettings.
     * @example
     * // Update one UiSettings
     * const uiSettings = await prisma.uiSettings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UiSettingsUpdateArgs>(args: SelectSubset<T, UiSettingsUpdateArgs<ExtArgs>>): Prisma__UiSettingsClient<$Result.GetResult<Prisma.$UiSettingsPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more UiSettings.
     * @param {UiSettingsDeleteManyArgs} args - Arguments to filter UiSettings to delete.
     * @example
     * // Delete a few UiSettings
     * const { count } = await prisma.uiSettings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UiSettingsDeleteManyArgs>(args?: SelectSubset<T, UiSettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UiSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UiSettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UiSettings
     * const uiSettings = await prisma.uiSettings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UiSettingsUpdateManyArgs>(args: SelectSubset<T, UiSettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UiSettings.
     * @param {UiSettingsUpsertArgs} args - Arguments to update or create a UiSettings.
     * @example
     * // Update or create a UiSettings
     * const uiSettings = await prisma.uiSettings.upsert({
     *   create: {
     *     // ... data to create a UiSettings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UiSettings we want to update
     *   }
     * })
     */
    upsert<T extends UiSettingsUpsertArgs>(args: SelectSubset<T, UiSettingsUpsertArgs<ExtArgs>>): Prisma__UiSettingsClient<$Result.GetResult<Prisma.$UiSettingsPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of UiSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UiSettingsCountArgs} args - Arguments to filter UiSettings to count.
     * @example
     * // Count the number of UiSettings
     * const count = await prisma.uiSettings.count({
     *   where: {
     *     // ... the filter for the UiSettings we want to count
     *   }
     * })
    **/
    count<T extends UiSettingsCountArgs>(
      args?: Subset<T, UiSettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UiSettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UiSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UiSettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UiSettingsAggregateArgs>(args: Subset<T, UiSettingsAggregateArgs>): Prisma.PrismaPromise<GetUiSettingsAggregateType<T>>

    /**
     * Group by UiSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UiSettingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UiSettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UiSettingsGroupByArgs['orderBy'] }
        : { orderBy?: UiSettingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UiSettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUiSettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UiSettings model
   */
  readonly fields: UiSettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UiSettings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UiSettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UiSettings model
   */ 
  interface UiSettingsFieldRefs {
    readonly userId: FieldRef<"UiSettings", 'String'>
    readonly showTutorial: FieldRef<"UiSettings", 'Boolean'>
    readonly theme: FieldRef<"UiSettings", 'String'>
    readonly lastSeenWidgets: FieldRef<"UiSettings", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * UiSettings findUnique
   */
  export type UiSettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UiSettings
     */
    select?: UiSettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UiSettingsInclude<ExtArgs> | null
    /**
     * Filter, which UiSettings to fetch.
     */
    where: UiSettingsWhereUniqueInput
  }

  /**
   * UiSettings findUniqueOrThrow
   */
  export type UiSettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UiSettings
     */
    select?: UiSettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UiSettingsInclude<ExtArgs> | null
    /**
     * Filter, which UiSettings to fetch.
     */
    where: UiSettingsWhereUniqueInput
  }

  /**
   * UiSettings findFirst
   */
  export type UiSettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UiSettings
     */
    select?: UiSettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UiSettingsInclude<ExtArgs> | null
    /**
     * Filter, which UiSettings to fetch.
     */
    where?: UiSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UiSettings to fetch.
     */
    orderBy?: UiSettingsOrderByWithRelationInput | UiSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UiSettings.
     */
    cursor?: UiSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UiSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UiSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UiSettings.
     */
    distinct?: UiSettingsScalarFieldEnum | UiSettingsScalarFieldEnum[]
  }

  /**
   * UiSettings findFirstOrThrow
   */
  export type UiSettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UiSettings
     */
    select?: UiSettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UiSettingsInclude<ExtArgs> | null
    /**
     * Filter, which UiSettings to fetch.
     */
    where?: UiSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UiSettings to fetch.
     */
    orderBy?: UiSettingsOrderByWithRelationInput | UiSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UiSettings.
     */
    cursor?: UiSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UiSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UiSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UiSettings.
     */
    distinct?: UiSettingsScalarFieldEnum | UiSettingsScalarFieldEnum[]
  }

  /**
   * UiSettings findMany
   */
  export type UiSettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UiSettings
     */
    select?: UiSettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UiSettingsInclude<ExtArgs> | null
    /**
     * Filter, which UiSettings to fetch.
     */
    where?: UiSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UiSettings to fetch.
     */
    orderBy?: UiSettingsOrderByWithRelationInput | UiSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UiSettings.
     */
    cursor?: UiSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UiSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UiSettings.
     */
    skip?: number
    distinct?: UiSettingsScalarFieldEnum | UiSettingsScalarFieldEnum[]
  }

  /**
   * UiSettings create
   */
  export type UiSettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UiSettings
     */
    select?: UiSettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UiSettingsInclude<ExtArgs> | null
    /**
     * The data needed to create a UiSettings.
     */
    data: XOR<UiSettingsCreateInput, UiSettingsUncheckedCreateInput>
  }

  /**
   * UiSettings createMany
   */
  export type UiSettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UiSettings.
     */
    data: UiSettingsCreateManyInput | UiSettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UiSettings createManyAndReturn
   */
  export type UiSettingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UiSettings
     */
    select?: UiSettingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many UiSettings.
     */
    data: UiSettingsCreateManyInput | UiSettingsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UiSettingsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UiSettings update
   */
  export type UiSettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UiSettings
     */
    select?: UiSettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UiSettingsInclude<ExtArgs> | null
    /**
     * The data needed to update a UiSettings.
     */
    data: XOR<UiSettingsUpdateInput, UiSettingsUncheckedUpdateInput>
    /**
     * Choose, which UiSettings to update.
     */
    where: UiSettingsWhereUniqueInput
  }

  /**
   * UiSettings updateMany
   */
  export type UiSettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UiSettings.
     */
    data: XOR<UiSettingsUpdateManyMutationInput, UiSettingsUncheckedUpdateManyInput>
    /**
     * Filter which UiSettings to update
     */
    where?: UiSettingsWhereInput
  }

  /**
   * UiSettings upsert
   */
  export type UiSettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UiSettings
     */
    select?: UiSettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UiSettingsInclude<ExtArgs> | null
    /**
     * The filter to search for the UiSettings to update in case it exists.
     */
    where: UiSettingsWhereUniqueInput
    /**
     * In case the UiSettings found by the `where` argument doesn't exist, create a new UiSettings with this data.
     */
    create: XOR<UiSettingsCreateInput, UiSettingsUncheckedCreateInput>
    /**
     * In case the UiSettings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UiSettingsUpdateInput, UiSettingsUncheckedUpdateInput>
  }

  /**
   * UiSettings delete
   */
  export type UiSettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UiSettings
     */
    select?: UiSettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UiSettingsInclude<ExtArgs> | null
    /**
     * Filter which UiSettings to delete.
     */
    where: UiSettingsWhereUniqueInput
  }

  /**
   * UiSettings deleteMany
   */
  export type UiSettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UiSettings to delete
     */
    where?: UiSettingsWhereInput
  }

  /**
   * UiSettings without action
   */
  export type UiSettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UiSettings
     */
    select?: UiSettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UiSettingsInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    phone: 'phone',
    passwordHash: 'passwordHash',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ChamaScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    rules: 'rules',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ChamaScalarFieldEnum = (typeof ChamaScalarFieldEnum)[keyof typeof ChamaScalarFieldEnum]


  export const MembershipScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    chamaId: 'chamaId',
    role: 'role',
    joinedAt: 'joinedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MembershipScalarFieldEnum = (typeof MembershipScalarFieldEnum)[keyof typeof MembershipScalarFieldEnum]


  export const InviteScalarFieldEnum: {
    id: 'id',
    chamaId: 'chamaId',
    token: 'token',
    sentToEmail: 'sentToEmail',
    expiresAt: 'expiresAt',
    usedAt: 'usedAt',
    createdAt: 'createdAt'
  };

  export type InviteScalarFieldEnum = (typeof InviteScalarFieldEnum)[keyof typeof InviteScalarFieldEnum]


  export const ContributionScalarFieldEnum: {
    id: 'id',
    chamaId: 'chamaId',
    userId: 'userId',
    amount: 'amount',
    currency: 'currency',
    status: 'status',
    date: 'date',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ContributionScalarFieldEnum = (typeof ContributionScalarFieldEnum)[keyof typeof ContributionScalarFieldEnum]


  export const PaymentScalarFieldEnum: {
    id: 'id',
    contributionId: 'contributionId',
    method: 'method',
    externalRef: 'externalRef',
    status: 'status',
    processedAt: 'processedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum]


  export const NotificationTypeScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    defaultDelivery: 'defaultDelivery'
  };

  export type NotificationTypeScalarFieldEnum = (typeof NotificationTypeScalarFieldEnum)[keyof typeof NotificationTypeScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    typeId: 'typeId',
    title: 'title',
    body: 'body',
    readAt: 'readAt',
    sentAt: 'sentAt',
    createdAt: 'createdAt'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const UiSettingsScalarFieldEnum: {
    userId: 'userId',
    showTutorial: 'showTutorial',
    theme: 'theme',
    lastSeenWidgets: 'lastSeenWidgets'
  };

  export type UiSettingsScalarFieldEnum = (typeof UiSettingsScalarFieldEnum)[keyof typeof UiSettingsScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'ContributionStatus'
   */
  export type EnumContributionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ContributionStatus'>
    


  /**
   * Reference to a field of type 'ContributionStatus[]'
   */
  export type ListEnumContributionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ContributionStatus[]'>
    


  /**
   * Reference to a field of type 'PaymentMethod'
   */
  export type EnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod'>
    


  /**
   * Reference to a field of type 'PaymentMethod[]'
   */
  export type ListEnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod[]'>
    


  /**
   * Reference to a field of type 'PaymentStatus'
   */
  export type EnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus'>
    


  /**
   * Reference to a field of type 'PaymentStatus[]'
   */
  export type ListEnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DeliveryMethod'
   */
  export type EnumDeliveryMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeliveryMethod'>
    


  /**
   * Reference to a field of type 'DeliveryMethod[]'
   */
  export type ListEnumDeliveryMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeliveryMethod[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    passwordHash?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    memberships?: MembershipListRelationFilter
    contributions?: ContributionListRelationFilter
    notifications?: NotificationListRelationFilter
    uiSettings?: XOR<UiSettingsNullableRelationFilter, UiSettingsWhereInput> | null
    Chama?: ChamaListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    passwordHash?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    memberships?: MembershipOrderByRelationAggregateInput
    contributions?: ContributionOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
    uiSettings?: UiSettingsOrderByWithRelationInput
    Chama?: ChamaOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    phone?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    passwordHash?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    memberships?: MembershipListRelationFilter
    contributions?: ContributionListRelationFilter
    notifications?: NotificationListRelationFilter
    uiSettings?: XOR<UiSettingsNullableRelationFilter, UiSettingsWhereInput> | null
    Chama?: ChamaListRelationFilter
  }, "id" | "email" | "phone">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    passwordHash?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    passwordHash?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type ChamaWhereInput = {
    AND?: ChamaWhereInput | ChamaWhereInput[]
    OR?: ChamaWhereInput[]
    NOT?: ChamaWhereInput | ChamaWhereInput[]
    id?: StringFilter<"Chama"> | string
    name?: StringFilter<"Chama"> | string
    description?: StringNullableFilter<"Chama"> | string | null
    rules?: StringNullableFilter<"Chama"> | string | null
    userId?: StringFilter<"Chama"> | string
    createdAt?: DateTimeFilter<"Chama"> | Date | string
    updatedAt?: DateTimeFilter<"Chama"> | Date | string
    createdBy?: XOR<UserRelationFilter, UserWhereInput>
    memberships?: MembershipListRelationFilter
    contributions?: ContributionListRelationFilter
    invites?: InviteListRelationFilter
  }

  export type ChamaOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    rules?: SortOrderInput | SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: UserOrderByWithRelationInput
    memberships?: MembershipOrderByRelationAggregateInput
    contributions?: ContributionOrderByRelationAggregateInput
    invites?: InviteOrderByRelationAggregateInput
  }

  export type ChamaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChamaWhereInput | ChamaWhereInput[]
    OR?: ChamaWhereInput[]
    NOT?: ChamaWhereInput | ChamaWhereInput[]
    name?: StringFilter<"Chama"> | string
    description?: StringNullableFilter<"Chama"> | string | null
    rules?: StringNullableFilter<"Chama"> | string | null
    userId?: StringFilter<"Chama"> | string
    createdAt?: DateTimeFilter<"Chama"> | Date | string
    updatedAt?: DateTimeFilter<"Chama"> | Date | string
    createdBy?: XOR<UserRelationFilter, UserWhereInput>
    memberships?: MembershipListRelationFilter
    contributions?: ContributionListRelationFilter
    invites?: InviteListRelationFilter
  }, "id">

  export type ChamaOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    rules?: SortOrderInput | SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ChamaCountOrderByAggregateInput
    _max?: ChamaMaxOrderByAggregateInput
    _min?: ChamaMinOrderByAggregateInput
  }

  export type ChamaScalarWhereWithAggregatesInput = {
    AND?: ChamaScalarWhereWithAggregatesInput | ChamaScalarWhereWithAggregatesInput[]
    OR?: ChamaScalarWhereWithAggregatesInput[]
    NOT?: ChamaScalarWhereWithAggregatesInput | ChamaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Chama"> | string
    name?: StringWithAggregatesFilter<"Chama"> | string
    description?: StringNullableWithAggregatesFilter<"Chama"> | string | null
    rules?: StringNullableWithAggregatesFilter<"Chama"> | string | null
    userId?: StringWithAggregatesFilter<"Chama"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Chama"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Chama"> | Date | string
  }

  export type MembershipWhereInput = {
    AND?: MembershipWhereInput | MembershipWhereInput[]
    OR?: MembershipWhereInput[]
    NOT?: MembershipWhereInput | MembershipWhereInput[]
    id?: StringFilter<"Membership"> | string
    userId?: StringFilter<"Membership"> | string
    chamaId?: StringFilter<"Membership"> | string
    role?: EnumUserRoleFilter<"Membership"> | $Enums.UserRole
    joinedAt?: DateTimeFilter<"Membership"> | Date | string
    createdAt?: DateTimeFilter<"Membership"> | Date | string
    updatedAt?: DateTimeFilter<"Membership"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    chama?: XOR<ChamaRelationFilter, ChamaWhereInput>
  }

  export type MembershipOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    chamaId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    chama?: ChamaOrderByWithRelationInput
  }

  export type MembershipWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MembershipWhereInput | MembershipWhereInput[]
    OR?: MembershipWhereInput[]
    NOT?: MembershipWhereInput | MembershipWhereInput[]
    userId?: StringFilter<"Membership"> | string
    chamaId?: StringFilter<"Membership"> | string
    role?: EnumUserRoleFilter<"Membership"> | $Enums.UserRole
    joinedAt?: DateTimeFilter<"Membership"> | Date | string
    createdAt?: DateTimeFilter<"Membership"> | Date | string
    updatedAt?: DateTimeFilter<"Membership"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    chama?: XOR<ChamaRelationFilter, ChamaWhereInput>
  }, "id">

  export type MembershipOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    chamaId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MembershipCountOrderByAggregateInput
    _max?: MembershipMaxOrderByAggregateInput
    _min?: MembershipMinOrderByAggregateInput
  }

  export type MembershipScalarWhereWithAggregatesInput = {
    AND?: MembershipScalarWhereWithAggregatesInput | MembershipScalarWhereWithAggregatesInput[]
    OR?: MembershipScalarWhereWithAggregatesInput[]
    NOT?: MembershipScalarWhereWithAggregatesInput | MembershipScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Membership"> | string
    userId?: StringWithAggregatesFilter<"Membership"> | string
    chamaId?: StringWithAggregatesFilter<"Membership"> | string
    role?: EnumUserRoleWithAggregatesFilter<"Membership"> | $Enums.UserRole
    joinedAt?: DateTimeWithAggregatesFilter<"Membership"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Membership"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Membership"> | Date | string
  }

  export type InviteWhereInput = {
    AND?: InviteWhereInput | InviteWhereInput[]
    OR?: InviteWhereInput[]
    NOT?: InviteWhereInput | InviteWhereInput[]
    id?: StringFilter<"Invite"> | string
    chamaId?: StringFilter<"Invite"> | string
    token?: StringFilter<"Invite"> | string
    sentToEmail?: StringFilter<"Invite"> | string
    expiresAt?: DateTimeFilter<"Invite"> | Date | string
    usedAt?: DateTimeNullableFilter<"Invite"> | Date | string | null
    createdAt?: DateTimeFilter<"Invite"> | Date | string
    chama?: XOR<ChamaRelationFilter, ChamaWhereInput>
  }

  export type InviteOrderByWithRelationInput = {
    id?: SortOrder
    chamaId?: SortOrder
    token?: SortOrder
    sentToEmail?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    chama?: ChamaOrderByWithRelationInput
  }

  export type InviteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: InviteWhereInput | InviteWhereInput[]
    OR?: InviteWhereInput[]
    NOT?: InviteWhereInput | InviteWhereInput[]
    chamaId?: StringFilter<"Invite"> | string
    sentToEmail?: StringFilter<"Invite"> | string
    expiresAt?: DateTimeFilter<"Invite"> | Date | string
    usedAt?: DateTimeNullableFilter<"Invite"> | Date | string | null
    createdAt?: DateTimeFilter<"Invite"> | Date | string
    chama?: XOR<ChamaRelationFilter, ChamaWhereInput>
  }, "id" | "token">

  export type InviteOrderByWithAggregationInput = {
    id?: SortOrder
    chamaId?: SortOrder
    token?: SortOrder
    sentToEmail?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: InviteCountOrderByAggregateInput
    _max?: InviteMaxOrderByAggregateInput
    _min?: InviteMinOrderByAggregateInput
  }

  export type InviteScalarWhereWithAggregatesInput = {
    AND?: InviteScalarWhereWithAggregatesInput | InviteScalarWhereWithAggregatesInput[]
    OR?: InviteScalarWhereWithAggregatesInput[]
    NOT?: InviteScalarWhereWithAggregatesInput | InviteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Invite"> | string
    chamaId?: StringWithAggregatesFilter<"Invite"> | string
    token?: StringWithAggregatesFilter<"Invite"> | string
    sentToEmail?: StringWithAggregatesFilter<"Invite"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Invite"> | Date | string
    usedAt?: DateTimeNullableWithAggregatesFilter<"Invite"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Invite"> | Date | string
  }

  export type ContributionWhereInput = {
    AND?: ContributionWhereInput | ContributionWhereInput[]
    OR?: ContributionWhereInput[]
    NOT?: ContributionWhereInput | ContributionWhereInput[]
    id?: StringFilter<"Contribution"> | string
    chamaId?: StringFilter<"Contribution"> | string
    userId?: StringFilter<"Contribution"> | string
    amount?: DecimalFilter<"Contribution"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Contribution"> | string
    status?: EnumContributionStatusFilter<"Contribution"> | $Enums.ContributionStatus
    date?: DateTimeFilter<"Contribution"> | Date | string
    createdAt?: DateTimeFilter<"Contribution"> | Date | string
    updatedAt?: DateTimeFilter<"Contribution"> | Date | string
    chama?: XOR<ChamaRelationFilter, ChamaWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
    payments?: PaymentListRelationFilter
  }

  export type ContributionOrderByWithRelationInput = {
    id?: SortOrder
    chamaId?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    chama?: ChamaOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    payments?: PaymentOrderByRelationAggregateInput
  }

  export type ContributionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ContributionWhereInput | ContributionWhereInput[]
    OR?: ContributionWhereInput[]
    NOT?: ContributionWhereInput | ContributionWhereInput[]
    chamaId?: StringFilter<"Contribution"> | string
    userId?: StringFilter<"Contribution"> | string
    amount?: DecimalFilter<"Contribution"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Contribution"> | string
    status?: EnumContributionStatusFilter<"Contribution"> | $Enums.ContributionStatus
    date?: DateTimeFilter<"Contribution"> | Date | string
    createdAt?: DateTimeFilter<"Contribution"> | Date | string
    updatedAt?: DateTimeFilter<"Contribution"> | Date | string
    chama?: XOR<ChamaRelationFilter, ChamaWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
    payments?: PaymentListRelationFilter
  }, "id">

  export type ContributionOrderByWithAggregationInput = {
    id?: SortOrder
    chamaId?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ContributionCountOrderByAggregateInput
    _avg?: ContributionAvgOrderByAggregateInput
    _max?: ContributionMaxOrderByAggregateInput
    _min?: ContributionMinOrderByAggregateInput
    _sum?: ContributionSumOrderByAggregateInput
  }

  export type ContributionScalarWhereWithAggregatesInput = {
    AND?: ContributionScalarWhereWithAggregatesInput | ContributionScalarWhereWithAggregatesInput[]
    OR?: ContributionScalarWhereWithAggregatesInput[]
    NOT?: ContributionScalarWhereWithAggregatesInput | ContributionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Contribution"> | string
    chamaId?: StringWithAggregatesFilter<"Contribution"> | string
    userId?: StringWithAggregatesFilter<"Contribution"> | string
    amount?: DecimalWithAggregatesFilter<"Contribution"> | Decimal | DecimalJsLike | number | string
    currency?: StringWithAggregatesFilter<"Contribution"> | string
    status?: EnumContributionStatusWithAggregatesFilter<"Contribution"> | $Enums.ContributionStatus
    date?: DateTimeWithAggregatesFilter<"Contribution"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Contribution"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Contribution"> | Date | string
  }

  export type PaymentWhereInput = {
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    id?: StringFilter<"Payment"> | string
    contributionId?: StringFilter<"Payment"> | string
    method?: EnumPaymentMethodFilter<"Payment"> | $Enums.PaymentMethod
    externalRef?: StringNullableFilter<"Payment"> | string | null
    status?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    processedAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    updatedAt?: DateTimeFilter<"Payment"> | Date | string
    contribution?: XOR<ContributionRelationFilter, ContributionWhereInput>
  }

  export type PaymentOrderByWithRelationInput = {
    id?: SortOrder
    contributionId?: SortOrder
    method?: SortOrder
    externalRef?: SortOrderInput | SortOrder
    status?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    contribution?: ContributionOrderByWithRelationInput
  }

  export type PaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    contributionId?: StringFilter<"Payment"> | string
    method?: EnumPaymentMethodFilter<"Payment"> | $Enums.PaymentMethod
    externalRef?: StringNullableFilter<"Payment"> | string | null
    status?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    processedAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    updatedAt?: DateTimeFilter<"Payment"> | Date | string
    contribution?: XOR<ContributionRelationFilter, ContributionWhereInput>
  }, "id">

  export type PaymentOrderByWithAggregationInput = {
    id?: SortOrder
    contributionId?: SortOrder
    method?: SortOrder
    externalRef?: SortOrderInput | SortOrder
    status?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PaymentCountOrderByAggregateInput
    _max?: PaymentMaxOrderByAggregateInput
    _min?: PaymentMinOrderByAggregateInput
  }

  export type PaymentScalarWhereWithAggregatesInput = {
    AND?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    OR?: PaymentScalarWhereWithAggregatesInput[]
    NOT?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Payment"> | string
    contributionId?: StringWithAggregatesFilter<"Payment"> | string
    method?: EnumPaymentMethodWithAggregatesFilter<"Payment"> | $Enums.PaymentMethod
    externalRef?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    status?: EnumPaymentStatusWithAggregatesFilter<"Payment"> | $Enums.PaymentStatus
    processedAt?: DateTimeNullableWithAggregatesFilter<"Payment"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
  }

  export type NotificationTypeWhereInput = {
    AND?: NotificationTypeWhereInput | NotificationTypeWhereInput[]
    OR?: NotificationTypeWhereInput[]
    NOT?: NotificationTypeWhereInput | NotificationTypeWhereInput[]
    id?: IntFilter<"NotificationType"> | number
    name?: StringFilter<"NotificationType"> | string
    description?: StringNullableFilter<"NotificationType"> | string | null
    defaultDelivery?: EnumDeliveryMethodFilter<"NotificationType"> | $Enums.DeliveryMethod
    notifications?: NotificationListRelationFilter
  }

  export type NotificationTypeOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    defaultDelivery?: SortOrder
    notifications?: NotificationOrderByRelationAggregateInput
  }

  export type NotificationTypeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    AND?: NotificationTypeWhereInput | NotificationTypeWhereInput[]
    OR?: NotificationTypeWhereInput[]
    NOT?: NotificationTypeWhereInput | NotificationTypeWhereInput[]
    description?: StringNullableFilter<"NotificationType"> | string | null
    defaultDelivery?: EnumDeliveryMethodFilter<"NotificationType"> | $Enums.DeliveryMethod
    notifications?: NotificationListRelationFilter
  }, "id" | "name">

  export type NotificationTypeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    defaultDelivery?: SortOrder
    _count?: NotificationTypeCountOrderByAggregateInput
    _avg?: NotificationTypeAvgOrderByAggregateInput
    _max?: NotificationTypeMaxOrderByAggregateInput
    _min?: NotificationTypeMinOrderByAggregateInput
    _sum?: NotificationTypeSumOrderByAggregateInput
  }

  export type NotificationTypeScalarWhereWithAggregatesInput = {
    AND?: NotificationTypeScalarWhereWithAggregatesInput | NotificationTypeScalarWhereWithAggregatesInput[]
    OR?: NotificationTypeScalarWhereWithAggregatesInput[]
    NOT?: NotificationTypeScalarWhereWithAggregatesInput | NotificationTypeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"NotificationType"> | number
    name?: StringWithAggregatesFilter<"NotificationType"> | string
    description?: StringNullableWithAggregatesFilter<"NotificationType"> | string | null
    defaultDelivery?: EnumDeliveryMethodWithAggregatesFilter<"NotificationType"> | $Enums.DeliveryMethod
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: StringFilter<"Notification"> | string
    userId?: StringFilter<"Notification"> | string
    typeId?: IntFilter<"Notification"> | number
    title?: StringFilter<"Notification"> | string
    body?: StringFilter<"Notification"> | string
    readAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    sentAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    type?: XOR<NotificationTypeRelationFilter, NotificationTypeWhereInput>
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    typeId?: SortOrder
    title?: SortOrder
    body?: SortOrder
    readAt?: SortOrderInput | SortOrder
    sentAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    type?: NotificationTypeOrderByWithRelationInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    userId?: StringFilter<"Notification"> | string
    typeId?: IntFilter<"Notification"> | number
    title?: StringFilter<"Notification"> | string
    body?: StringFilter<"Notification"> | string
    readAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    sentAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    type?: XOR<NotificationTypeRelationFilter, NotificationTypeWhereInput>
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    typeId?: SortOrder
    title?: SortOrder
    body?: SortOrder
    readAt?: SortOrderInput | SortOrder
    sentAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _avg?: NotificationAvgOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
    _sum?: NotificationSumOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Notification"> | string
    userId?: StringWithAggregatesFilter<"Notification"> | string
    typeId?: IntWithAggregatesFilter<"Notification"> | number
    title?: StringWithAggregatesFilter<"Notification"> | string
    body?: StringWithAggregatesFilter<"Notification"> | string
    readAt?: DateTimeNullableWithAggregatesFilter<"Notification"> | Date | string | null
    sentAt?: DateTimeNullableWithAggregatesFilter<"Notification"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type UiSettingsWhereInput = {
    AND?: UiSettingsWhereInput | UiSettingsWhereInput[]
    OR?: UiSettingsWhereInput[]
    NOT?: UiSettingsWhereInput | UiSettingsWhereInput[]
    userId?: StringFilter<"UiSettings"> | string
    showTutorial?: BoolFilter<"UiSettings"> | boolean
    theme?: StringNullableFilter<"UiSettings"> | string | null
    lastSeenWidgets?: JsonNullableFilter<"UiSettings">
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type UiSettingsOrderByWithRelationInput = {
    userId?: SortOrder
    showTutorial?: SortOrder
    theme?: SortOrderInput | SortOrder
    lastSeenWidgets?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UiSettingsWhereUniqueInput = Prisma.AtLeast<{
    userId?: string
    AND?: UiSettingsWhereInput | UiSettingsWhereInput[]
    OR?: UiSettingsWhereInput[]
    NOT?: UiSettingsWhereInput | UiSettingsWhereInput[]
    showTutorial?: BoolFilter<"UiSettings"> | boolean
    theme?: StringNullableFilter<"UiSettings"> | string | null
    lastSeenWidgets?: JsonNullableFilter<"UiSettings">
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "userId">

  export type UiSettingsOrderByWithAggregationInput = {
    userId?: SortOrder
    showTutorial?: SortOrder
    theme?: SortOrderInput | SortOrder
    lastSeenWidgets?: SortOrderInput | SortOrder
    _count?: UiSettingsCountOrderByAggregateInput
    _max?: UiSettingsMaxOrderByAggregateInput
    _min?: UiSettingsMinOrderByAggregateInput
  }

  export type UiSettingsScalarWhereWithAggregatesInput = {
    AND?: UiSettingsScalarWhereWithAggregatesInput | UiSettingsScalarWhereWithAggregatesInput[]
    OR?: UiSettingsScalarWhereWithAggregatesInput[]
    NOT?: UiSettingsScalarWhereWithAggregatesInput | UiSettingsScalarWhereWithAggregatesInput[]
    userId?: StringWithAggregatesFilter<"UiSettings"> | string
    showTutorial?: BoolWithAggregatesFilter<"UiSettings"> | boolean
    theme?: StringNullableWithAggregatesFilter<"UiSettings"> | string | null
    lastSeenWidgets?: JsonNullableWithAggregatesFilter<"UiSettings">
  }

  export type UserCreateInput = {
    id?: string
    name?: string | null
    email?: string | null
    phone?: string | null
    passwordHash?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    memberships?: MembershipCreateNestedManyWithoutUserInput
    contributions?: ContributionCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    uiSettings?: UiSettingsCreateNestedOneWithoutUserInput
    Chama?: ChamaCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name?: string | null
    email?: string | null
    phone?: string | null
    passwordHash?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    memberships?: MembershipUncheckedCreateNestedManyWithoutUserInput
    contributions?: ContributionUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    uiSettings?: UiSettingsUncheckedCreateNestedOneWithoutUserInput
    Chama?: ChamaUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUpdateManyWithoutUserNestedInput
    contributions?: ContributionUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    uiSettings?: UiSettingsUpdateOneWithoutUserNestedInput
    Chama?: ChamaUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUncheckedUpdateManyWithoutUserNestedInput
    contributions?: ContributionUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    uiSettings?: UiSettingsUncheckedUpdateOneWithoutUserNestedInput
    Chama?: ChamaUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name?: string | null
    email?: string | null
    phone?: string | null
    passwordHash?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChamaCreateInput = {
    id?: string
    name: string
    description?: string | null
    rules?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutChamaInput
    memberships?: MembershipCreateNestedManyWithoutChamaInput
    contributions?: ContributionCreateNestedManyWithoutChamaInput
    invites?: InviteCreateNestedManyWithoutChamaInput
  }

  export type ChamaUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    rules?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    memberships?: MembershipUncheckedCreateNestedManyWithoutChamaInput
    contributions?: ContributionUncheckedCreateNestedManyWithoutChamaInput
    invites?: InviteUncheckedCreateNestedManyWithoutChamaInput
  }

  export type ChamaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    rules?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutChamaNestedInput
    memberships?: MembershipUpdateManyWithoutChamaNestedInput
    contributions?: ContributionUpdateManyWithoutChamaNestedInput
    invites?: InviteUpdateManyWithoutChamaNestedInput
  }

  export type ChamaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    rules?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUncheckedUpdateManyWithoutChamaNestedInput
    contributions?: ContributionUncheckedUpdateManyWithoutChamaNestedInput
    invites?: InviteUncheckedUpdateManyWithoutChamaNestedInput
  }

  export type ChamaCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    rules?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChamaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    rules?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChamaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    rules?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MembershipCreateInput = {
    id?: string
    role?: $Enums.UserRole
    joinedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutMembershipsInput
    chama: ChamaCreateNestedOneWithoutMembershipsInput
  }

  export type MembershipUncheckedCreateInput = {
    id?: string
    userId: string
    chamaId: string
    role?: $Enums.UserRole
    joinedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MembershipUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMembershipsNestedInput
    chama?: ChamaUpdateOneRequiredWithoutMembershipsNestedInput
  }

  export type MembershipUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    chamaId?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MembershipCreateManyInput = {
    id?: string
    userId: string
    chamaId: string
    role?: $Enums.UserRole
    joinedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MembershipUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MembershipUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    chamaId?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InviteCreateInput = {
    id?: string
    token: string
    sentToEmail: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
    chama: ChamaCreateNestedOneWithoutInvitesInput
  }

  export type InviteUncheckedCreateInput = {
    id?: string
    chamaId: string
    token: string
    sentToEmail: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type InviteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    sentToEmail?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chama?: ChamaUpdateOneRequiredWithoutInvitesNestedInput
  }

  export type InviteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    chamaId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    sentToEmail?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InviteCreateManyInput = {
    id?: string
    chamaId: string
    token: string
    sentToEmail: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type InviteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    sentToEmail?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InviteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    chamaId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    sentToEmail?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContributionCreateInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status?: $Enums.ContributionStatus
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    chama: ChamaCreateNestedOneWithoutContributionsInput
    user: UserCreateNestedOneWithoutContributionsInput
    payments?: PaymentCreateNestedManyWithoutContributionInput
  }

  export type ContributionUncheckedCreateInput = {
    id?: string
    chamaId: string
    userId: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status?: $Enums.ContributionStatus
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: PaymentUncheckedCreateNestedManyWithoutContributionInput
  }

  export type ContributionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumContributionStatusFieldUpdateOperationsInput | $Enums.ContributionStatus
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chama?: ChamaUpdateOneRequiredWithoutContributionsNestedInput
    user?: UserUpdateOneRequiredWithoutContributionsNestedInput
    payments?: PaymentUpdateManyWithoutContributionNestedInput
  }

  export type ContributionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    chamaId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumContributionStatusFieldUpdateOperationsInput | $Enums.ContributionStatus
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentUncheckedUpdateManyWithoutContributionNestedInput
  }

  export type ContributionCreateManyInput = {
    id?: string
    chamaId: string
    userId: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status?: $Enums.ContributionStatus
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContributionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumContributionStatusFieldUpdateOperationsInput | $Enums.ContributionStatus
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContributionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    chamaId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumContributionStatusFieldUpdateOperationsInput | $Enums.ContributionStatus
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCreateInput = {
    id?: string
    method?: $Enums.PaymentMethod
    externalRef?: string | null
    status?: $Enums.PaymentStatus
    processedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    contribution: ContributionCreateNestedOneWithoutPaymentsInput
  }

  export type PaymentUncheckedCreateInput = {
    id?: string
    contributionId: string
    method?: $Enums.PaymentMethod
    externalRef?: string | null
    status?: $Enums.PaymentStatus
    processedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    externalRef?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contribution?: ContributionUpdateOneRequiredWithoutPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    contributionId?: StringFieldUpdateOperationsInput | string
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    externalRef?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCreateManyInput = {
    id?: string
    contributionId: string
    method?: $Enums.PaymentMethod
    externalRef?: string | null
    status?: $Enums.PaymentStatus
    processedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    externalRef?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    contributionId?: StringFieldUpdateOperationsInput | string
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    externalRef?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationTypeCreateInput = {
    name: string
    description?: string | null
    defaultDelivery: $Enums.DeliveryMethod
    notifications?: NotificationCreateNestedManyWithoutTypeInput
  }

  export type NotificationTypeUncheckedCreateInput = {
    id?: number
    name: string
    description?: string | null
    defaultDelivery: $Enums.DeliveryMethod
    notifications?: NotificationUncheckedCreateNestedManyWithoutTypeInput
  }

  export type NotificationTypeUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    defaultDelivery?: EnumDeliveryMethodFieldUpdateOperationsInput | $Enums.DeliveryMethod
    notifications?: NotificationUpdateManyWithoutTypeNestedInput
  }

  export type NotificationTypeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    defaultDelivery?: EnumDeliveryMethodFieldUpdateOperationsInput | $Enums.DeliveryMethod
    notifications?: NotificationUncheckedUpdateManyWithoutTypeNestedInput
  }

  export type NotificationTypeCreateManyInput = {
    id?: number
    name: string
    description?: string | null
    defaultDelivery: $Enums.DeliveryMethod
  }

  export type NotificationTypeUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    defaultDelivery?: EnumDeliveryMethodFieldUpdateOperationsInput | $Enums.DeliveryMethod
  }

  export type NotificationTypeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    defaultDelivery?: EnumDeliveryMethodFieldUpdateOperationsInput | $Enums.DeliveryMethod
  }

  export type NotificationCreateInput = {
    id?: string
    title: string
    body: string
    readAt?: Date | string | null
    sentAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutNotificationsInput
    type: NotificationTypeCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: string
    userId: string
    typeId: number
    title: string
    body: string
    readAt?: Date | string | null
    sentAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
    type?: NotificationTypeUpdateOneRequiredWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    typeId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    id?: string
    userId: string
    typeId: number
    title: string
    body: string
    readAt?: Date | string | null
    sentAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    typeId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UiSettingsCreateInput = {
    showTutorial?: boolean
    theme?: string | null
    lastSeenWidgets?: NullableJsonNullValueInput | InputJsonValue
    user: UserCreateNestedOneWithoutUiSettingsInput
  }

  export type UiSettingsUncheckedCreateInput = {
    userId: string
    showTutorial?: boolean
    theme?: string | null
    lastSeenWidgets?: NullableJsonNullValueInput | InputJsonValue
  }

  export type UiSettingsUpdateInput = {
    showTutorial?: BoolFieldUpdateOperationsInput | boolean
    theme?: NullableStringFieldUpdateOperationsInput | string | null
    lastSeenWidgets?: NullableJsonNullValueInput | InputJsonValue
    user?: UserUpdateOneRequiredWithoutUiSettingsNestedInput
  }

  export type UiSettingsUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    showTutorial?: BoolFieldUpdateOperationsInput | boolean
    theme?: NullableStringFieldUpdateOperationsInput | string | null
    lastSeenWidgets?: NullableJsonNullValueInput | InputJsonValue
  }

  export type UiSettingsCreateManyInput = {
    userId: string
    showTutorial?: boolean
    theme?: string | null
    lastSeenWidgets?: NullableJsonNullValueInput | InputJsonValue
  }

  export type UiSettingsUpdateManyMutationInput = {
    showTutorial?: BoolFieldUpdateOperationsInput | boolean
    theme?: NullableStringFieldUpdateOperationsInput | string | null
    lastSeenWidgets?: NullableJsonNullValueInput | InputJsonValue
  }

  export type UiSettingsUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    showTutorial?: BoolFieldUpdateOperationsInput | boolean
    theme?: NullableStringFieldUpdateOperationsInput | string | null
    lastSeenWidgets?: NullableJsonNullValueInput | InputJsonValue
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type MembershipListRelationFilter = {
    every?: MembershipWhereInput
    some?: MembershipWhereInput
    none?: MembershipWhereInput
  }

  export type ContributionListRelationFilter = {
    every?: ContributionWhereInput
    some?: ContributionWhereInput
    none?: ContributionWhereInput
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type UiSettingsNullableRelationFilter = {
    is?: UiSettingsWhereInput | null
    isNot?: UiSettingsWhereInput | null
  }

  export type ChamaListRelationFilter = {
    every?: ChamaWhereInput
    some?: ChamaWhereInput
    none?: ChamaWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type MembershipOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ContributionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChamaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type InviteListRelationFilter = {
    every?: InviteWhereInput
    some?: InviteWhereInput
    none?: InviteWhereInput
  }

  export type InviteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChamaCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    rules?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChamaMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    rules?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChamaMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    rules?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChamaRelationFilter = {
    is?: ChamaWhereInput
    isNot?: ChamaWhereInput
  }

  export type MembershipCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    chamaId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MembershipMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    chamaId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MembershipMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    chamaId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type InviteCountOrderByAggregateInput = {
    id?: SortOrder
    chamaId?: SortOrder
    token?: SortOrder
    sentToEmail?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type InviteMaxOrderByAggregateInput = {
    id?: SortOrder
    chamaId?: SortOrder
    token?: SortOrder
    sentToEmail?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type InviteMinOrderByAggregateInput = {
    id?: SortOrder
    chamaId?: SortOrder
    token?: SortOrder
    sentToEmail?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type EnumContributionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ContributionStatus | EnumContributionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ContributionStatus[] | ListEnumContributionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ContributionStatus[] | ListEnumContributionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumContributionStatusFilter<$PrismaModel> | $Enums.ContributionStatus
  }

  export type PaymentListRelationFilter = {
    every?: PaymentWhereInput
    some?: PaymentWhereInput
    none?: PaymentWhereInput
  }

  export type PaymentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ContributionCountOrderByAggregateInput = {
    id?: SortOrder
    chamaId?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ContributionAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type ContributionMaxOrderByAggregateInput = {
    id?: SortOrder
    chamaId?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ContributionMinOrderByAggregateInput = {
    id?: SortOrder
    chamaId?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ContributionSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type EnumContributionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ContributionStatus | EnumContributionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ContributionStatus[] | ListEnumContributionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ContributionStatus[] | ListEnumContributionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumContributionStatusWithAggregatesFilter<$PrismaModel> | $Enums.ContributionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumContributionStatusFilter<$PrismaModel>
    _max?: NestedEnumContributionStatusFilter<$PrismaModel>
  }

  export type EnumPaymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodFilter<$PrismaModel> | $Enums.PaymentMethod
  }

  export type EnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
  }

  export type ContributionRelationFilter = {
    is?: ContributionWhereInput
    isNot?: ContributionWhereInput
  }

  export type PaymentCountOrderByAggregateInput = {
    id?: SortOrder
    contributionId?: SortOrder
    method?: SortOrder
    externalRef?: SortOrder
    status?: SortOrder
    processedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    contributionId?: SortOrder
    method?: SortOrder
    externalRef?: SortOrder
    status?: SortOrder
    processedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentMinOrderByAggregateInput = {
    id?: SortOrder
    contributionId?: SortOrder
    method?: SortOrder
    externalRef?: SortOrder
    status?: SortOrder
    processedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumPaymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodFilter<$PrismaModel>
  }

  export type EnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumDeliveryMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.DeliveryMethod | EnumDeliveryMethodFieldRefInput<$PrismaModel>
    in?: $Enums.DeliveryMethod[] | ListEnumDeliveryMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeliveryMethod[] | ListEnumDeliveryMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumDeliveryMethodFilter<$PrismaModel> | $Enums.DeliveryMethod
  }

  export type NotificationTypeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    defaultDelivery?: SortOrder
  }

  export type NotificationTypeAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type NotificationTypeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    defaultDelivery?: SortOrder
  }

  export type NotificationTypeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    defaultDelivery?: SortOrder
  }

  export type NotificationTypeSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumDeliveryMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DeliveryMethod | EnumDeliveryMethodFieldRefInput<$PrismaModel>
    in?: $Enums.DeliveryMethod[] | ListEnumDeliveryMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeliveryMethod[] | ListEnumDeliveryMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumDeliveryMethodWithAggregatesFilter<$PrismaModel> | $Enums.DeliveryMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeliveryMethodFilter<$PrismaModel>
    _max?: NestedEnumDeliveryMethodFilter<$PrismaModel>
  }

  export type NotificationTypeRelationFilter = {
    is?: NotificationTypeWhereInput
    isNot?: NotificationTypeWhereInput
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    typeId?: SortOrder
    title?: SortOrder
    body?: SortOrder
    readAt?: SortOrder
    sentAt?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationAvgOrderByAggregateInput = {
    typeId?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    typeId?: SortOrder
    title?: SortOrder
    body?: SortOrder
    readAt?: SortOrder
    sentAt?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    typeId?: SortOrder
    title?: SortOrder
    body?: SortOrder
    readAt?: SortOrder
    sentAt?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationSumOrderByAggregateInput = {
    typeId?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UiSettingsCountOrderByAggregateInput = {
    userId?: SortOrder
    showTutorial?: SortOrder
    theme?: SortOrder
    lastSeenWidgets?: SortOrder
  }

  export type UiSettingsMaxOrderByAggregateInput = {
    userId?: SortOrder
    showTutorial?: SortOrder
    theme?: SortOrder
  }

  export type UiSettingsMinOrderByAggregateInput = {
    userId?: SortOrder
    showTutorial?: SortOrder
    theme?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type MembershipCreateNestedManyWithoutUserInput = {
    create?: XOR<MembershipCreateWithoutUserInput, MembershipUncheckedCreateWithoutUserInput> | MembershipCreateWithoutUserInput[] | MembershipUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MembershipCreateOrConnectWithoutUserInput | MembershipCreateOrConnectWithoutUserInput[]
    createMany?: MembershipCreateManyUserInputEnvelope
    connect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
  }

  export type ContributionCreateNestedManyWithoutUserInput = {
    create?: XOR<ContributionCreateWithoutUserInput, ContributionUncheckedCreateWithoutUserInput> | ContributionCreateWithoutUserInput[] | ContributionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ContributionCreateOrConnectWithoutUserInput | ContributionCreateOrConnectWithoutUserInput[]
    createMany?: ContributionCreateManyUserInputEnvelope
    connect?: ContributionWhereUniqueInput | ContributionWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type UiSettingsCreateNestedOneWithoutUserInput = {
    create?: XOR<UiSettingsCreateWithoutUserInput, UiSettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UiSettingsCreateOrConnectWithoutUserInput
    connect?: UiSettingsWhereUniqueInput
  }

  export type ChamaCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<ChamaCreateWithoutCreatedByInput, ChamaUncheckedCreateWithoutCreatedByInput> | ChamaCreateWithoutCreatedByInput[] | ChamaUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ChamaCreateOrConnectWithoutCreatedByInput | ChamaCreateOrConnectWithoutCreatedByInput[]
    createMany?: ChamaCreateManyCreatedByInputEnvelope
    connect?: ChamaWhereUniqueInput | ChamaWhereUniqueInput[]
  }

  export type MembershipUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<MembershipCreateWithoutUserInput, MembershipUncheckedCreateWithoutUserInput> | MembershipCreateWithoutUserInput[] | MembershipUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MembershipCreateOrConnectWithoutUserInput | MembershipCreateOrConnectWithoutUserInput[]
    createMany?: MembershipCreateManyUserInputEnvelope
    connect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
  }

  export type ContributionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ContributionCreateWithoutUserInput, ContributionUncheckedCreateWithoutUserInput> | ContributionCreateWithoutUserInput[] | ContributionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ContributionCreateOrConnectWithoutUserInput | ContributionCreateOrConnectWithoutUserInput[]
    createMany?: ContributionCreateManyUserInputEnvelope
    connect?: ContributionWhereUniqueInput | ContributionWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type UiSettingsUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<UiSettingsCreateWithoutUserInput, UiSettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UiSettingsCreateOrConnectWithoutUserInput
    connect?: UiSettingsWhereUniqueInput
  }

  export type ChamaUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<ChamaCreateWithoutCreatedByInput, ChamaUncheckedCreateWithoutCreatedByInput> | ChamaCreateWithoutCreatedByInput[] | ChamaUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ChamaCreateOrConnectWithoutCreatedByInput | ChamaCreateOrConnectWithoutCreatedByInput[]
    createMany?: ChamaCreateManyCreatedByInputEnvelope
    connect?: ChamaWhereUniqueInput | ChamaWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type MembershipUpdateManyWithoutUserNestedInput = {
    create?: XOR<MembershipCreateWithoutUserInput, MembershipUncheckedCreateWithoutUserInput> | MembershipCreateWithoutUserInput[] | MembershipUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MembershipCreateOrConnectWithoutUserInput | MembershipCreateOrConnectWithoutUserInput[]
    upsert?: MembershipUpsertWithWhereUniqueWithoutUserInput | MembershipUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MembershipCreateManyUserInputEnvelope
    set?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    disconnect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    delete?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    connect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    update?: MembershipUpdateWithWhereUniqueWithoutUserInput | MembershipUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MembershipUpdateManyWithWhereWithoutUserInput | MembershipUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MembershipScalarWhereInput | MembershipScalarWhereInput[]
  }

  export type ContributionUpdateManyWithoutUserNestedInput = {
    create?: XOR<ContributionCreateWithoutUserInput, ContributionUncheckedCreateWithoutUserInput> | ContributionCreateWithoutUserInput[] | ContributionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ContributionCreateOrConnectWithoutUserInput | ContributionCreateOrConnectWithoutUserInput[]
    upsert?: ContributionUpsertWithWhereUniqueWithoutUserInput | ContributionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ContributionCreateManyUserInputEnvelope
    set?: ContributionWhereUniqueInput | ContributionWhereUniqueInput[]
    disconnect?: ContributionWhereUniqueInput | ContributionWhereUniqueInput[]
    delete?: ContributionWhereUniqueInput | ContributionWhereUniqueInput[]
    connect?: ContributionWhereUniqueInput | ContributionWhereUniqueInput[]
    update?: ContributionUpdateWithWhereUniqueWithoutUserInput | ContributionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ContributionUpdateManyWithWhereWithoutUserInput | ContributionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ContributionScalarWhereInput | ContributionScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UiSettingsUpdateOneWithoutUserNestedInput = {
    create?: XOR<UiSettingsCreateWithoutUserInput, UiSettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UiSettingsCreateOrConnectWithoutUserInput
    upsert?: UiSettingsUpsertWithoutUserInput
    disconnect?: UiSettingsWhereInput | boolean
    delete?: UiSettingsWhereInput | boolean
    connect?: UiSettingsWhereUniqueInput
    update?: XOR<XOR<UiSettingsUpdateToOneWithWhereWithoutUserInput, UiSettingsUpdateWithoutUserInput>, UiSettingsUncheckedUpdateWithoutUserInput>
  }

  export type ChamaUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<ChamaCreateWithoutCreatedByInput, ChamaUncheckedCreateWithoutCreatedByInput> | ChamaCreateWithoutCreatedByInput[] | ChamaUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ChamaCreateOrConnectWithoutCreatedByInput | ChamaCreateOrConnectWithoutCreatedByInput[]
    upsert?: ChamaUpsertWithWhereUniqueWithoutCreatedByInput | ChamaUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: ChamaCreateManyCreatedByInputEnvelope
    set?: ChamaWhereUniqueInput | ChamaWhereUniqueInput[]
    disconnect?: ChamaWhereUniqueInput | ChamaWhereUniqueInput[]
    delete?: ChamaWhereUniqueInput | ChamaWhereUniqueInput[]
    connect?: ChamaWhereUniqueInput | ChamaWhereUniqueInput[]
    update?: ChamaUpdateWithWhereUniqueWithoutCreatedByInput | ChamaUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: ChamaUpdateManyWithWhereWithoutCreatedByInput | ChamaUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: ChamaScalarWhereInput | ChamaScalarWhereInput[]
  }

  export type MembershipUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<MembershipCreateWithoutUserInput, MembershipUncheckedCreateWithoutUserInput> | MembershipCreateWithoutUserInput[] | MembershipUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MembershipCreateOrConnectWithoutUserInput | MembershipCreateOrConnectWithoutUserInput[]
    upsert?: MembershipUpsertWithWhereUniqueWithoutUserInput | MembershipUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MembershipCreateManyUserInputEnvelope
    set?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    disconnect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    delete?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    connect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    update?: MembershipUpdateWithWhereUniqueWithoutUserInput | MembershipUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MembershipUpdateManyWithWhereWithoutUserInput | MembershipUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MembershipScalarWhereInput | MembershipScalarWhereInput[]
  }

  export type ContributionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ContributionCreateWithoutUserInput, ContributionUncheckedCreateWithoutUserInput> | ContributionCreateWithoutUserInput[] | ContributionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ContributionCreateOrConnectWithoutUserInput | ContributionCreateOrConnectWithoutUserInput[]
    upsert?: ContributionUpsertWithWhereUniqueWithoutUserInput | ContributionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ContributionCreateManyUserInputEnvelope
    set?: ContributionWhereUniqueInput | ContributionWhereUniqueInput[]
    disconnect?: ContributionWhereUniqueInput | ContributionWhereUniqueInput[]
    delete?: ContributionWhereUniqueInput | ContributionWhereUniqueInput[]
    connect?: ContributionWhereUniqueInput | ContributionWhereUniqueInput[]
    update?: ContributionUpdateWithWhereUniqueWithoutUserInput | ContributionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ContributionUpdateManyWithWhereWithoutUserInput | ContributionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ContributionScalarWhereInput | ContributionScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UiSettingsUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<UiSettingsCreateWithoutUserInput, UiSettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UiSettingsCreateOrConnectWithoutUserInput
    upsert?: UiSettingsUpsertWithoutUserInput
    disconnect?: UiSettingsWhereInput | boolean
    delete?: UiSettingsWhereInput | boolean
    connect?: UiSettingsWhereUniqueInput
    update?: XOR<XOR<UiSettingsUpdateToOneWithWhereWithoutUserInput, UiSettingsUpdateWithoutUserInput>, UiSettingsUncheckedUpdateWithoutUserInput>
  }

  export type ChamaUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<ChamaCreateWithoutCreatedByInput, ChamaUncheckedCreateWithoutCreatedByInput> | ChamaCreateWithoutCreatedByInput[] | ChamaUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ChamaCreateOrConnectWithoutCreatedByInput | ChamaCreateOrConnectWithoutCreatedByInput[]
    upsert?: ChamaUpsertWithWhereUniqueWithoutCreatedByInput | ChamaUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: ChamaCreateManyCreatedByInputEnvelope
    set?: ChamaWhereUniqueInput | ChamaWhereUniqueInput[]
    disconnect?: ChamaWhereUniqueInput | ChamaWhereUniqueInput[]
    delete?: ChamaWhereUniqueInput | ChamaWhereUniqueInput[]
    connect?: ChamaWhereUniqueInput | ChamaWhereUniqueInput[]
    update?: ChamaUpdateWithWhereUniqueWithoutCreatedByInput | ChamaUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: ChamaUpdateManyWithWhereWithoutCreatedByInput | ChamaUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: ChamaScalarWhereInput | ChamaScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutChamaInput = {
    create?: XOR<UserCreateWithoutChamaInput, UserUncheckedCreateWithoutChamaInput>
    connectOrCreate?: UserCreateOrConnectWithoutChamaInput
    connect?: UserWhereUniqueInput
  }

  export type MembershipCreateNestedManyWithoutChamaInput = {
    create?: XOR<MembershipCreateWithoutChamaInput, MembershipUncheckedCreateWithoutChamaInput> | MembershipCreateWithoutChamaInput[] | MembershipUncheckedCreateWithoutChamaInput[]
    connectOrCreate?: MembershipCreateOrConnectWithoutChamaInput | MembershipCreateOrConnectWithoutChamaInput[]
    createMany?: MembershipCreateManyChamaInputEnvelope
    connect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
  }

  export type ContributionCreateNestedManyWithoutChamaInput = {
    create?: XOR<ContributionCreateWithoutChamaInput, ContributionUncheckedCreateWithoutChamaInput> | ContributionCreateWithoutChamaInput[] | ContributionUncheckedCreateWithoutChamaInput[]
    connectOrCreate?: ContributionCreateOrConnectWithoutChamaInput | ContributionCreateOrConnectWithoutChamaInput[]
    createMany?: ContributionCreateManyChamaInputEnvelope
    connect?: ContributionWhereUniqueInput | ContributionWhereUniqueInput[]
  }

  export type InviteCreateNestedManyWithoutChamaInput = {
    create?: XOR<InviteCreateWithoutChamaInput, InviteUncheckedCreateWithoutChamaInput> | InviteCreateWithoutChamaInput[] | InviteUncheckedCreateWithoutChamaInput[]
    connectOrCreate?: InviteCreateOrConnectWithoutChamaInput | InviteCreateOrConnectWithoutChamaInput[]
    createMany?: InviteCreateManyChamaInputEnvelope
    connect?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
  }

  export type MembershipUncheckedCreateNestedManyWithoutChamaInput = {
    create?: XOR<MembershipCreateWithoutChamaInput, MembershipUncheckedCreateWithoutChamaInput> | MembershipCreateWithoutChamaInput[] | MembershipUncheckedCreateWithoutChamaInput[]
    connectOrCreate?: MembershipCreateOrConnectWithoutChamaInput | MembershipCreateOrConnectWithoutChamaInput[]
    createMany?: MembershipCreateManyChamaInputEnvelope
    connect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
  }

  export type ContributionUncheckedCreateNestedManyWithoutChamaInput = {
    create?: XOR<ContributionCreateWithoutChamaInput, ContributionUncheckedCreateWithoutChamaInput> | ContributionCreateWithoutChamaInput[] | ContributionUncheckedCreateWithoutChamaInput[]
    connectOrCreate?: ContributionCreateOrConnectWithoutChamaInput | ContributionCreateOrConnectWithoutChamaInput[]
    createMany?: ContributionCreateManyChamaInputEnvelope
    connect?: ContributionWhereUniqueInput | ContributionWhereUniqueInput[]
  }

  export type InviteUncheckedCreateNestedManyWithoutChamaInput = {
    create?: XOR<InviteCreateWithoutChamaInput, InviteUncheckedCreateWithoutChamaInput> | InviteCreateWithoutChamaInput[] | InviteUncheckedCreateWithoutChamaInput[]
    connectOrCreate?: InviteCreateOrConnectWithoutChamaInput | InviteCreateOrConnectWithoutChamaInput[]
    createMany?: InviteCreateManyChamaInputEnvelope
    connect?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutChamaNestedInput = {
    create?: XOR<UserCreateWithoutChamaInput, UserUncheckedCreateWithoutChamaInput>
    connectOrCreate?: UserCreateOrConnectWithoutChamaInput
    upsert?: UserUpsertWithoutChamaInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutChamaInput, UserUpdateWithoutChamaInput>, UserUncheckedUpdateWithoutChamaInput>
  }

  export type MembershipUpdateManyWithoutChamaNestedInput = {
    create?: XOR<MembershipCreateWithoutChamaInput, MembershipUncheckedCreateWithoutChamaInput> | MembershipCreateWithoutChamaInput[] | MembershipUncheckedCreateWithoutChamaInput[]
    connectOrCreate?: MembershipCreateOrConnectWithoutChamaInput | MembershipCreateOrConnectWithoutChamaInput[]
    upsert?: MembershipUpsertWithWhereUniqueWithoutChamaInput | MembershipUpsertWithWhereUniqueWithoutChamaInput[]
    createMany?: MembershipCreateManyChamaInputEnvelope
    set?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    disconnect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    delete?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    connect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    update?: MembershipUpdateWithWhereUniqueWithoutChamaInput | MembershipUpdateWithWhereUniqueWithoutChamaInput[]
    updateMany?: MembershipUpdateManyWithWhereWithoutChamaInput | MembershipUpdateManyWithWhereWithoutChamaInput[]
    deleteMany?: MembershipScalarWhereInput | MembershipScalarWhereInput[]
  }

  export type ContributionUpdateManyWithoutChamaNestedInput = {
    create?: XOR<ContributionCreateWithoutChamaInput, ContributionUncheckedCreateWithoutChamaInput> | ContributionCreateWithoutChamaInput[] | ContributionUncheckedCreateWithoutChamaInput[]
    connectOrCreate?: ContributionCreateOrConnectWithoutChamaInput | ContributionCreateOrConnectWithoutChamaInput[]
    upsert?: ContributionUpsertWithWhereUniqueWithoutChamaInput | ContributionUpsertWithWhereUniqueWithoutChamaInput[]
    createMany?: ContributionCreateManyChamaInputEnvelope
    set?: ContributionWhereUniqueInput | ContributionWhereUniqueInput[]
    disconnect?: ContributionWhereUniqueInput | ContributionWhereUniqueInput[]
    delete?: ContributionWhereUniqueInput | ContributionWhereUniqueInput[]
    connect?: ContributionWhereUniqueInput | ContributionWhereUniqueInput[]
    update?: ContributionUpdateWithWhereUniqueWithoutChamaInput | ContributionUpdateWithWhereUniqueWithoutChamaInput[]
    updateMany?: ContributionUpdateManyWithWhereWithoutChamaInput | ContributionUpdateManyWithWhereWithoutChamaInput[]
    deleteMany?: ContributionScalarWhereInput | ContributionScalarWhereInput[]
  }

  export type InviteUpdateManyWithoutChamaNestedInput = {
    create?: XOR<InviteCreateWithoutChamaInput, InviteUncheckedCreateWithoutChamaInput> | InviteCreateWithoutChamaInput[] | InviteUncheckedCreateWithoutChamaInput[]
    connectOrCreate?: InviteCreateOrConnectWithoutChamaInput | InviteCreateOrConnectWithoutChamaInput[]
    upsert?: InviteUpsertWithWhereUniqueWithoutChamaInput | InviteUpsertWithWhereUniqueWithoutChamaInput[]
    createMany?: InviteCreateManyChamaInputEnvelope
    set?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
    disconnect?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
    delete?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
    connect?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
    update?: InviteUpdateWithWhereUniqueWithoutChamaInput | InviteUpdateWithWhereUniqueWithoutChamaInput[]
    updateMany?: InviteUpdateManyWithWhereWithoutChamaInput | InviteUpdateManyWithWhereWithoutChamaInput[]
    deleteMany?: InviteScalarWhereInput | InviteScalarWhereInput[]
  }

  export type MembershipUncheckedUpdateManyWithoutChamaNestedInput = {
    create?: XOR<MembershipCreateWithoutChamaInput, MembershipUncheckedCreateWithoutChamaInput> | MembershipCreateWithoutChamaInput[] | MembershipUncheckedCreateWithoutChamaInput[]
    connectOrCreate?: MembershipCreateOrConnectWithoutChamaInput | MembershipCreateOrConnectWithoutChamaInput[]
    upsert?: MembershipUpsertWithWhereUniqueWithoutChamaInput | MembershipUpsertWithWhereUniqueWithoutChamaInput[]
    createMany?: MembershipCreateManyChamaInputEnvelope
    set?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    disconnect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    delete?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    connect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    update?: MembershipUpdateWithWhereUniqueWithoutChamaInput | MembershipUpdateWithWhereUniqueWithoutChamaInput[]
    updateMany?: MembershipUpdateManyWithWhereWithoutChamaInput | MembershipUpdateManyWithWhereWithoutChamaInput[]
    deleteMany?: MembershipScalarWhereInput | MembershipScalarWhereInput[]
  }

  export type ContributionUncheckedUpdateManyWithoutChamaNestedInput = {
    create?: XOR<ContributionCreateWithoutChamaInput, ContributionUncheckedCreateWithoutChamaInput> | ContributionCreateWithoutChamaInput[] | ContributionUncheckedCreateWithoutChamaInput[]
    connectOrCreate?: ContributionCreateOrConnectWithoutChamaInput | ContributionCreateOrConnectWithoutChamaInput[]
    upsert?: ContributionUpsertWithWhereUniqueWithoutChamaInput | ContributionUpsertWithWhereUniqueWithoutChamaInput[]
    createMany?: ContributionCreateManyChamaInputEnvelope
    set?: ContributionWhereUniqueInput | ContributionWhereUniqueInput[]
    disconnect?: ContributionWhereUniqueInput | ContributionWhereUniqueInput[]
    delete?: ContributionWhereUniqueInput | ContributionWhereUniqueInput[]
    connect?: ContributionWhereUniqueInput | ContributionWhereUniqueInput[]
    update?: ContributionUpdateWithWhereUniqueWithoutChamaInput | ContributionUpdateWithWhereUniqueWithoutChamaInput[]
    updateMany?: ContributionUpdateManyWithWhereWithoutChamaInput | ContributionUpdateManyWithWhereWithoutChamaInput[]
    deleteMany?: ContributionScalarWhereInput | ContributionScalarWhereInput[]
  }

  export type InviteUncheckedUpdateManyWithoutChamaNestedInput = {
    create?: XOR<InviteCreateWithoutChamaInput, InviteUncheckedCreateWithoutChamaInput> | InviteCreateWithoutChamaInput[] | InviteUncheckedCreateWithoutChamaInput[]
    connectOrCreate?: InviteCreateOrConnectWithoutChamaInput | InviteCreateOrConnectWithoutChamaInput[]
    upsert?: InviteUpsertWithWhereUniqueWithoutChamaInput | InviteUpsertWithWhereUniqueWithoutChamaInput[]
    createMany?: InviteCreateManyChamaInputEnvelope
    set?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
    disconnect?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
    delete?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
    connect?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
    update?: InviteUpdateWithWhereUniqueWithoutChamaInput | InviteUpdateWithWhereUniqueWithoutChamaInput[]
    updateMany?: InviteUpdateManyWithWhereWithoutChamaInput | InviteUpdateManyWithWhereWithoutChamaInput[]
    deleteMany?: InviteScalarWhereInput | InviteScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutMembershipsInput = {
    create?: XOR<UserCreateWithoutMembershipsInput, UserUncheckedCreateWithoutMembershipsInput>
    connectOrCreate?: UserCreateOrConnectWithoutMembershipsInput
    connect?: UserWhereUniqueInput
  }

  export type ChamaCreateNestedOneWithoutMembershipsInput = {
    create?: XOR<ChamaCreateWithoutMembershipsInput, ChamaUncheckedCreateWithoutMembershipsInput>
    connectOrCreate?: ChamaCreateOrConnectWithoutMembershipsInput
    connect?: ChamaWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutMembershipsNestedInput = {
    create?: XOR<UserCreateWithoutMembershipsInput, UserUncheckedCreateWithoutMembershipsInput>
    connectOrCreate?: UserCreateOrConnectWithoutMembershipsInput
    upsert?: UserUpsertWithoutMembershipsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMembershipsInput, UserUpdateWithoutMembershipsInput>, UserUncheckedUpdateWithoutMembershipsInput>
  }

  export type ChamaUpdateOneRequiredWithoutMembershipsNestedInput = {
    create?: XOR<ChamaCreateWithoutMembershipsInput, ChamaUncheckedCreateWithoutMembershipsInput>
    connectOrCreate?: ChamaCreateOrConnectWithoutMembershipsInput
    upsert?: ChamaUpsertWithoutMembershipsInput
    connect?: ChamaWhereUniqueInput
    update?: XOR<XOR<ChamaUpdateToOneWithWhereWithoutMembershipsInput, ChamaUpdateWithoutMembershipsInput>, ChamaUncheckedUpdateWithoutMembershipsInput>
  }

  export type ChamaCreateNestedOneWithoutInvitesInput = {
    create?: XOR<ChamaCreateWithoutInvitesInput, ChamaUncheckedCreateWithoutInvitesInput>
    connectOrCreate?: ChamaCreateOrConnectWithoutInvitesInput
    connect?: ChamaWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ChamaUpdateOneRequiredWithoutInvitesNestedInput = {
    create?: XOR<ChamaCreateWithoutInvitesInput, ChamaUncheckedCreateWithoutInvitesInput>
    connectOrCreate?: ChamaCreateOrConnectWithoutInvitesInput
    upsert?: ChamaUpsertWithoutInvitesInput
    connect?: ChamaWhereUniqueInput
    update?: XOR<XOR<ChamaUpdateToOneWithWhereWithoutInvitesInput, ChamaUpdateWithoutInvitesInput>, ChamaUncheckedUpdateWithoutInvitesInput>
  }

  export type ChamaCreateNestedOneWithoutContributionsInput = {
    create?: XOR<ChamaCreateWithoutContributionsInput, ChamaUncheckedCreateWithoutContributionsInput>
    connectOrCreate?: ChamaCreateOrConnectWithoutContributionsInput
    connect?: ChamaWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutContributionsInput = {
    create?: XOR<UserCreateWithoutContributionsInput, UserUncheckedCreateWithoutContributionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutContributionsInput
    connect?: UserWhereUniqueInput
  }

  export type PaymentCreateNestedManyWithoutContributionInput = {
    create?: XOR<PaymentCreateWithoutContributionInput, PaymentUncheckedCreateWithoutContributionInput> | PaymentCreateWithoutContributionInput[] | PaymentUncheckedCreateWithoutContributionInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutContributionInput | PaymentCreateOrConnectWithoutContributionInput[]
    createMany?: PaymentCreateManyContributionInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type PaymentUncheckedCreateNestedManyWithoutContributionInput = {
    create?: XOR<PaymentCreateWithoutContributionInput, PaymentUncheckedCreateWithoutContributionInput> | PaymentCreateWithoutContributionInput[] | PaymentUncheckedCreateWithoutContributionInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutContributionInput | PaymentCreateOrConnectWithoutContributionInput[]
    createMany?: PaymentCreateManyContributionInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EnumContributionStatusFieldUpdateOperationsInput = {
    set?: $Enums.ContributionStatus
  }

  export type ChamaUpdateOneRequiredWithoutContributionsNestedInput = {
    create?: XOR<ChamaCreateWithoutContributionsInput, ChamaUncheckedCreateWithoutContributionsInput>
    connectOrCreate?: ChamaCreateOrConnectWithoutContributionsInput
    upsert?: ChamaUpsertWithoutContributionsInput
    connect?: ChamaWhereUniqueInput
    update?: XOR<XOR<ChamaUpdateToOneWithWhereWithoutContributionsInput, ChamaUpdateWithoutContributionsInput>, ChamaUncheckedUpdateWithoutContributionsInput>
  }

  export type UserUpdateOneRequiredWithoutContributionsNestedInput = {
    create?: XOR<UserCreateWithoutContributionsInput, UserUncheckedCreateWithoutContributionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutContributionsInput
    upsert?: UserUpsertWithoutContributionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutContributionsInput, UserUpdateWithoutContributionsInput>, UserUncheckedUpdateWithoutContributionsInput>
  }

  export type PaymentUpdateManyWithoutContributionNestedInput = {
    create?: XOR<PaymentCreateWithoutContributionInput, PaymentUncheckedCreateWithoutContributionInput> | PaymentCreateWithoutContributionInput[] | PaymentUncheckedCreateWithoutContributionInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutContributionInput | PaymentCreateOrConnectWithoutContributionInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutContributionInput | PaymentUpsertWithWhereUniqueWithoutContributionInput[]
    createMany?: PaymentCreateManyContributionInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutContributionInput | PaymentUpdateWithWhereUniqueWithoutContributionInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutContributionInput | PaymentUpdateManyWithWhereWithoutContributionInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type PaymentUncheckedUpdateManyWithoutContributionNestedInput = {
    create?: XOR<PaymentCreateWithoutContributionInput, PaymentUncheckedCreateWithoutContributionInput> | PaymentCreateWithoutContributionInput[] | PaymentUncheckedCreateWithoutContributionInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutContributionInput | PaymentCreateOrConnectWithoutContributionInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutContributionInput | PaymentUpsertWithWhereUniqueWithoutContributionInput[]
    createMany?: PaymentCreateManyContributionInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutContributionInput | PaymentUpdateWithWhereUniqueWithoutContributionInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutContributionInput | PaymentUpdateManyWithWhereWithoutContributionInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type ContributionCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<ContributionCreateWithoutPaymentsInput, ContributionUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: ContributionCreateOrConnectWithoutPaymentsInput
    connect?: ContributionWhereUniqueInput
  }

  export type EnumPaymentMethodFieldUpdateOperationsInput = {
    set?: $Enums.PaymentMethod
  }

  export type EnumPaymentStatusFieldUpdateOperationsInput = {
    set?: $Enums.PaymentStatus
  }

  export type ContributionUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: XOR<ContributionCreateWithoutPaymentsInput, ContributionUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: ContributionCreateOrConnectWithoutPaymentsInput
    upsert?: ContributionUpsertWithoutPaymentsInput
    connect?: ContributionWhereUniqueInput
    update?: XOR<XOR<ContributionUpdateToOneWithWhereWithoutPaymentsInput, ContributionUpdateWithoutPaymentsInput>, ContributionUncheckedUpdateWithoutPaymentsInput>
  }

  export type NotificationCreateNestedManyWithoutTypeInput = {
    create?: XOR<NotificationCreateWithoutTypeInput, NotificationUncheckedCreateWithoutTypeInput> | NotificationCreateWithoutTypeInput[] | NotificationUncheckedCreateWithoutTypeInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutTypeInput | NotificationCreateOrConnectWithoutTypeInput[]
    createMany?: NotificationCreateManyTypeInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutTypeInput = {
    create?: XOR<NotificationCreateWithoutTypeInput, NotificationUncheckedCreateWithoutTypeInput> | NotificationCreateWithoutTypeInput[] | NotificationUncheckedCreateWithoutTypeInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutTypeInput | NotificationCreateOrConnectWithoutTypeInput[]
    createMany?: NotificationCreateManyTypeInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type EnumDeliveryMethodFieldUpdateOperationsInput = {
    set?: $Enums.DeliveryMethod
  }

  export type NotificationUpdateManyWithoutTypeNestedInput = {
    create?: XOR<NotificationCreateWithoutTypeInput, NotificationUncheckedCreateWithoutTypeInput> | NotificationCreateWithoutTypeInput[] | NotificationUncheckedCreateWithoutTypeInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutTypeInput | NotificationCreateOrConnectWithoutTypeInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutTypeInput | NotificationUpsertWithWhereUniqueWithoutTypeInput[]
    createMany?: NotificationCreateManyTypeInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutTypeInput | NotificationUpdateWithWhereUniqueWithoutTypeInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutTypeInput | NotificationUpdateManyWithWhereWithoutTypeInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NotificationUncheckedUpdateManyWithoutTypeNestedInput = {
    create?: XOR<NotificationCreateWithoutTypeInput, NotificationUncheckedCreateWithoutTypeInput> | NotificationCreateWithoutTypeInput[] | NotificationUncheckedCreateWithoutTypeInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutTypeInput | NotificationCreateOrConnectWithoutTypeInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutTypeInput | NotificationUpsertWithWhereUniqueWithoutTypeInput[]
    createMany?: NotificationCreateManyTypeInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutTypeInput | NotificationUpdateWithWhereUniqueWithoutTypeInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutTypeInput | NotificationUpdateManyWithWhereWithoutTypeInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    connect?: UserWhereUniqueInput
  }

  export type NotificationTypeCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<NotificationTypeCreateWithoutNotificationsInput, NotificationTypeUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: NotificationTypeCreateOrConnectWithoutNotificationsInput
    connect?: NotificationTypeWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutNotificationsNestedInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    upsert?: UserUpsertWithoutNotificationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNotificationsInput, UserUpdateWithoutNotificationsInput>, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type NotificationTypeUpdateOneRequiredWithoutNotificationsNestedInput = {
    create?: XOR<NotificationTypeCreateWithoutNotificationsInput, NotificationTypeUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: NotificationTypeCreateOrConnectWithoutNotificationsInput
    upsert?: NotificationTypeUpsertWithoutNotificationsInput
    connect?: NotificationTypeWhereUniqueInput
    update?: XOR<XOR<NotificationTypeUpdateToOneWithWhereWithoutNotificationsInput, NotificationTypeUpdateWithoutNotificationsInput>, NotificationTypeUncheckedUpdateWithoutNotificationsInput>
  }

  export type UserCreateNestedOneWithoutUiSettingsInput = {
    create?: XOR<UserCreateWithoutUiSettingsInput, UserUncheckedCreateWithoutUiSettingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUiSettingsInput
    connect?: UserWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneRequiredWithoutUiSettingsNestedInput = {
    create?: XOR<UserCreateWithoutUiSettingsInput, UserUncheckedCreateWithoutUiSettingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUiSettingsInput
    upsert?: UserUpsertWithoutUiSettingsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUiSettingsInput, UserUpdateWithoutUiSettingsInput>, UserUncheckedUpdateWithoutUiSettingsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedEnumContributionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ContributionStatus | EnumContributionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ContributionStatus[] | ListEnumContributionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ContributionStatus[] | ListEnumContributionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumContributionStatusFilter<$PrismaModel> | $Enums.ContributionStatus
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedEnumContributionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ContributionStatus | EnumContributionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ContributionStatus[] | ListEnumContributionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ContributionStatus[] | ListEnumContributionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumContributionStatusWithAggregatesFilter<$PrismaModel> | $Enums.ContributionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumContributionStatusFilter<$PrismaModel>
    _max?: NestedEnumContributionStatusFilter<$PrismaModel>
  }

  export type NestedEnumPaymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodFilter<$PrismaModel> | $Enums.PaymentMethod
  }

  export type NestedEnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
  }

  export type NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodFilter<$PrismaModel>
  }

  export type NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
  }

  export type NestedEnumDeliveryMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.DeliveryMethod | EnumDeliveryMethodFieldRefInput<$PrismaModel>
    in?: $Enums.DeliveryMethod[] | ListEnumDeliveryMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeliveryMethod[] | ListEnumDeliveryMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumDeliveryMethodFilter<$PrismaModel> | $Enums.DeliveryMethod
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumDeliveryMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DeliveryMethod | EnumDeliveryMethodFieldRefInput<$PrismaModel>
    in?: $Enums.DeliveryMethod[] | ListEnumDeliveryMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeliveryMethod[] | ListEnumDeliveryMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumDeliveryMethodWithAggregatesFilter<$PrismaModel> | $Enums.DeliveryMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeliveryMethodFilter<$PrismaModel>
    _max?: NestedEnumDeliveryMethodFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type MembershipCreateWithoutUserInput = {
    id?: string
    role?: $Enums.UserRole
    joinedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    chama: ChamaCreateNestedOneWithoutMembershipsInput
  }

  export type MembershipUncheckedCreateWithoutUserInput = {
    id?: string
    chamaId: string
    role?: $Enums.UserRole
    joinedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MembershipCreateOrConnectWithoutUserInput = {
    where: MembershipWhereUniqueInput
    create: XOR<MembershipCreateWithoutUserInput, MembershipUncheckedCreateWithoutUserInput>
  }

  export type MembershipCreateManyUserInputEnvelope = {
    data: MembershipCreateManyUserInput | MembershipCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ContributionCreateWithoutUserInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status?: $Enums.ContributionStatus
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    chama: ChamaCreateNestedOneWithoutContributionsInput
    payments?: PaymentCreateNestedManyWithoutContributionInput
  }

  export type ContributionUncheckedCreateWithoutUserInput = {
    id?: string
    chamaId: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status?: $Enums.ContributionStatus
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: PaymentUncheckedCreateNestedManyWithoutContributionInput
  }

  export type ContributionCreateOrConnectWithoutUserInput = {
    where: ContributionWhereUniqueInput
    create: XOR<ContributionCreateWithoutUserInput, ContributionUncheckedCreateWithoutUserInput>
  }

  export type ContributionCreateManyUserInputEnvelope = {
    data: ContributionCreateManyUserInput | ContributionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutUserInput = {
    id?: string
    title: string
    body: string
    readAt?: Date | string | null
    sentAt?: Date | string | null
    createdAt?: Date | string
    type: NotificationTypeCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateWithoutUserInput = {
    id?: string
    typeId: number
    title: string
    body: string
    readAt?: Date | string | null
    sentAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutUserInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationCreateManyUserInputEnvelope = {
    data: NotificationCreateManyUserInput | NotificationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UiSettingsCreateWithoutUserInput = {
    showTutorial?: boolean
    theme?: string | null
    lastSeenWidgets?: NullableJsonNullValueInput | InputJsonValue
  }

  export type UiSettingsUncheckedCreateWithoutUserInput = {
    showTutorial?: boolean
    theme?: string | null
    lastSeenWidgets?: NullableJsonNullValueInput | InputJsonValue
  }

  export type UiSettingsCreateOrConnectWithoutUserInput = {
    where: UiSettingsWhereUniqueInput
    create: XOR<UiSettingsCreateWithoutUserInput, UiSettingsUncheckedCreateWithoutUserInput>
  }

  export type ChamaCreateWithoutCreatedByInput = {
    id?: string
    name: string
    description?: string | null
    rules?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    memberships?: MembershipCreateNestedManyWithoutChamaInput
    contributions?: ContributionCreateNestedManyWithoutChamaInput
    invites?: InviteCreateNestedManyWithoutChamaInput
  }

  export type ChamaUncheckedCreateWithoutCreatedByInput = {
    id?: string
    name: string
    description?: string | null
    rules?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    memberships?: MembershipUncheckedCreateNestedManyWithoutChamaInput
    contributions?: ContributionUncheckedCreateNestedManyWithoutChamaInput
    invites?: InviteUncheckedCreateNestedManyWithoutChamaInput
  }

  export type ChamaCreateOrConnectWithoutCreatedByInput = {
    where: ChamaWhereUniqueInput
    create: XOR<ChamaCreateWithoutCreatedByInput, ChamaUncheckedCreateWithoutCreatedByInput>
  }

  export type ChamaCreateManyCreatedByInputEnvelope = {
    data: ChamaCreateManyCreatedByInput | ChamaCreateManyCreatedByInput[]
    skipDuplicates?: boolean
  }

  export type MembershipUpsertWithWhereUniqueWithoutUserInput = {
    where: MembershipWhereUniqueInput
    update: XOR<MembershipUpdateWithoutUserInput, MembershipUncheckedUpdateWithoutUserInput>
    create: XOR<MembershipCreateWithoutUserInput, MembershipUncheckedCreateWithoutUserInput>
  }

  export type MembershipUpdateWithWhereUniqueWithoutUserInput = {
    where: MembershipWhereUniqueInput
    data: XOR<MembershipUpdateWithoutUserInput, MembershipUncheckedUpdateWithoutUserInput>
  }

  export type MembershipUpdateManyWithWhereWithoutUserInput = {
    where: MembershipScalarWhereInput
    data: XOR<MembershipUpdateManyMutationInput, MembershipUncheckedUpdateManyWithoutUserInput>
  }

  export type MembershipScalarWhereInput = {
    AND?: MembershipScalarWhereInput | MembershipScalarWhereInput[]
    OR?: MembershipScalarWhereInput[]
    NOT?: MembershipScalarWhereInput | MembershipScalarWhereInput[]
    id?: StringFilter<"Membership"> | string
    userId?: StringFilter<"Membership"> | string
    chamaId?: StringFilter<"Membership"> | string
    role?: EnumUserRoleFilter<"Membership"> | $Enums.UserRole
    joinedAt?: DateTimeFilter<"Membership"> | Date | string
    createdAt?: DateTimeFilter<"Membership"> | Date | string
    updatedAt?: DateTimeFilter<"Membership"> | Date | string
  }

  export type ContributionUpsertWithWhereUniqueWithoutUserInput = {
    where: ContributionWhereUniqueInput
    update: XOR<ContributionUpdateWithoutUserInput, ContributionUncheckedUpdateWithoutUserInput>
    create: XOR<ContributionCreateWithoutUserInput, ContributionUncheckedCreateWithoutUserInput>
  }

  export type ContributionUpdateWithWhereUniqueWithoutUserInput = {
    where: ContributionWhereUniqueInput
    data: XOR<ContributionUpdateWithoutUserInput, ContributionUncheckedUpdateWithoutUserInput>
  }

  export type ContributionUpdateManyWithWhereWithoutUserInput = {
    where: ContributionScalarWhereInput
    data: XOR<ContributionUpdateManyMutationInput, ContributionUncheckedUpdateManyWithoutUserInput>
  }

  export type ContributionScalarWhereInput = {
    AND?: ContributionScalarWhereInput | ContributionScalarWhereInput[]
    OR?: ContributionScalarWhereInput[]
    NOT?: ContributionScalarWhereInput | ContributionScalarWhereInput[]
    id?: StringFilter<"Contribution"> | string
    chamaId?: StringFilter<"Contribution"> | string
    userId?: StringFilter<"Contribution"> | string
    amount?: DecimalFilter<"Contribution"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Contribution"> | string
    status?: EnumContributionStatusFilter<"Contribution"> | $Enums.ContributionStatus
    date?: DateTimeFilter<"Contribution"> | Date | string
    createdAt?: DateTimeFilter<"Contribution"> | Date | string
    updatedAt?: DateTimeFilter<"Contribution"> | Date | string
  }

  export type NotificationUpsertWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
  }

  export type NotificationUpdateManyWithWhereWithoutUserInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    id?: StringFilter<"Notification"> | string
    userId?: StringFilter<"Notification"> | string
    typeId?: IntFilter<"Notification"> | number
    title?: StringFilter<"Notification"> | string
    body?: StringFilter<"Notification"> | string
    readAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    sentAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
  }

  export type UiSettingsUpsertWithoutUserInput = {
    update: XOR<UiSettingsUpdateWithoutUserInput, UiSettingsUncheckedUpdateWithoutUserInput>
    create: XOR<UiSettingsCreateWithoutUserInput, UiSettingsUncheckedCreateWithoutUserInput>
    where?: UiSettingsWhereInput
  }

  export type UiSettingsUpdateToOneWithWhereWithoutUserInput = {
    where?: UiSettingsWhereInput
    data: XOR<UiSettingsUpdateWithoutUserInput, UiSettingsUncheckedUpdateWithoutUserInput>
  }

  export type UiSettingsUpdateWithoutUserInput = {
    showTutorial?: BoolFieldUpdateOperationsInput | boolean
    theme?: NullableStringFieldUpdateOperationsInput | string | null
    lastSeenWidgets?: NullableJsonNullValueInput | InputJsonValue
  }

  export type UiSettingsUncheckedUpdateWithoutUserInput = {
    showTutorial?: BoolFieldUpdateOperationsInput | boolean
    theme?: NullableStringFieldUpdateOperationsInput | string | null
    lastSeenWidgets?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ChamaUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: ChamaWhereUniqueInput
    update: XOR<ChamaUpdateWithoutCreatedByInput, ChamaUncheckedUpdateWithoutCreatedByInput>
    create: XOR<ChamaCreateWithoutCreatedByInput, ChamaUncheckedCreateWithoutCreatedByInput>
  }

  export type ChamaUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: ChamaWhereUniqueInput
    data: XOR<ChamaUpdateWithoutCreatedByInput, ChamaUncheckedUpdateWithoutCreatedByInput>
  }

  export type ChamaUpdateManyWithWhereWithoutCreatedByInput = {
    where: ChamaScalarWhereInput
    data: XOR<ChamaUpdateManyMutationInput, ChamaUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type ChamaScalarWhereInput = {
    AND?: ChamaScalarWhereInput | ChamaScalarWhereInput[]
    OR?: ChamaScalarWhereInput[]
    NOT?: ChamaScalarWhereInput | ChamaScalarWhereInput[]
    id?: StringFilter<"Chama"> | string
    name?: StringFilter<"Chama"> | string
    description?: StringNullableFilter<"Chama"> | string | null
    rules?: StringNullableFilter<"Chama"> | string | null
    userId?: StringFilter<"Chama"> | string
    createdAt?: DateTimeFilter<"Chama"> | Date | string
    updatedAt?: DateTimeFilter<"Chama"> | Date | string
  }

  export type UserCreateWithoutChamaInput = {
    id?: string
    name?: string | null
    email?: string | null
    phone?: string | null
    passwordHash?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    memberships?: MembershipCreateNestedManyWithoutUserInput
    contributions?: ContributionCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    uiSettings?: UiSettingsCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutChamaInput = {
    id?: string
    name?: string | null
    email?: string | null
    phone?: string | null
    passwordHash?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    memberships?: MembershipUncheckedCreateNestedManyWithoutUserInput
    contributions?: ContributionUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    uiSettings?: UiSettingsUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutChamaInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutChamaInput, UserUncheckedCreateWithoutChamaInput>
  }

  export type MembershipCreateWithoutChamaInput = {
    id?: string
    role?: $Enums.UserRole
    joinedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutMembershipsInput
  }

  export type MembershipUncheckedCreateWithoutChamaInput = {
    id?: string
    userId: string
    role?: $Enums.UserRole
    joinedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MembershipCreateOrConnectWithoutChamaInput = {
    where: MembershipWhereUniqueInput
    create: XOR<MembershipCreateWithoutChamaInput, MembershipUncheckedCreateWithoutChamaInput>
  }

  export type MembershipCreateManyChamaInputEnvelope = {
    data: MembershipCreateManyChamaInput | MembershipCreateManyChamaInput[]
    skipDuplicates?: boolean
  }

  export type ContributionCreateWithoutChamaInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status?: $Enums.ContributionStatus
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutContributionsInput
    payments?: PaymentCreateNestedManyWithoutContributionInput
  }

  export type ContributionUncheckedCreateWithoutChamaInput = {
    id?: string
    userId: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status?: $Enums.ContributionStatus
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: PaymentUncheckedCreateNestedManyWithoutContributionInput
  }

  export type ContributionCreateOrConnectWithoutChamaInput = {
    where: ContributionWhereUniqueInput
    create: XOR<ContributionCreateWithoutChamaInput, ContributionUncheckedCreateWithoutChamaInput>
  }

  export type ContributionCreateManyChamaInputEnvelope = {
    data: ContributionCreateManyChamaInput | ContributionCreateManyChamaInput[]
    skipDuplicates?: boolean
  }

  export type InviteCreateWithoutChamaInput = {
    id?: string
    token: string
    sentToEmail: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type InviteUncheckedCreateWithoutChamaInput = {
    id?: string
    token: string
    sentToEmail: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type InviteCreateOrConnectWithoutChamaInput = {
    where: InviteWhereUniqueInput
    create: XOR<InviteCreateWithoutChamaInput, InviteUncheckedCreateWithoutChamaInput>
  }

  export type InviteCreateManyChamaInputEnvelope = {
    data: InviteCreateManyChamaInput | InviteCreateManyChamaInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutChamaInput = {
    update: XOR<UserUpdateWithoutChamaInput, UserUncheckedUpdateWithoutChamaInput>
    create: XOR<UserCreateWithoutChamaInput, UserUncheckedCreateWithoutChamaInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutChamaInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutChamaInput, UserUncheckedUpdateWithoutChamaInput>
  }

  export type UserUpdateWithoutChamaInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUpdateManyWithoutUserNestedInput
    contributions?: ContributionUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    uiSettings?: UiSettingsUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutChamaInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUncheckedUpdateManyWithoutUserNestedInput
    contributions?: ContributionUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    uiSettings?: UiSettingsUncheckedUpdateOneWithoutUserNestedInput
  }

  export type MembershipUpsertWithWhereUniqueWithoutChamaInput = {
    where: MembershipWhereUniqueInput
    update: XOR<MembershipUpdateWithoutChamaInput, MembershipUncheckedUpdateWithoutChamaInput>
    create: XOR<MembershipCreateWithoutChamaInput, MembershipUncheckedCreateWithoutChamaInput>
  }

  export type MembershipUpdateWithWhereUniqueWithoutChamaInput = {
    where: MembershipWhereUniqueInput
    data: XOR<MembershipUpdateWithoutChamaInput, MembershipUncheckedUpdateWithoutChamaInput>
  }

  export type MembershipUpdateManyWithWhereWithoutChamaInput = {
    where: MembershipScalarWhereInput
    data: XOR<MembershipUpdateManyMutationInput, MembershipUncheckedUpdateManyWithoutChamaInput>
  }

  export type ContributionUpsertWithWhereUniqueWithoutChamaInput = {
    where: ContributionWhereUniqueInput
    update: XOR<ContributionUpdateWithoutChamaInput, ContributionUncheckedUpdateWithoutChamaInput>
    create: XOR<ContributionCreateWithoutChamaInput, ContributionUncheckedCreateWithoutChamaInput>
  }

  export type ContributionUpdateWithWhereUniqueWithoutChamaInput = {
    where: ContributionWhereUniqueInput
    data: XOR<ContributionUpdateWithoutChamaInput, ContributionUncheckedUpdateWithoutChamaInput>
  }

  export type ContributionUpdateManyWithWhereWithoutChamaInput = {
    where: ContributionScalarWhereInput
    data: XOR<ContributionUpdateManyMutationInput, ContributionUncheckedUpdateManyWithoutChamaInput>
  }

  export type InviteUpsertWithWhereUniqueWithoutChamaInput = {
    where: InviteWhereUniqueInput
    update: XOR<InviteUpdateWithoutChamaInput, InviteUncheckedUpdateWithoutChamaInput>
    create: XOR<InviteCreateWithoutChamaInput, InviteUncheckedCreateWithoutChamaInput>
  }

  export type InviteUpdateWithWhereUniqueWithoutChamaInput = {
    where: InviteWhereUniqueInput
    data: XOR<InviteUpdateWithoutChamaInput, InviteUncheckedUpdateWithoutChamaInput>
  }

  export type InviteUpdateManyWithWhereWithoutChamaInput = {
    where: InviteScalarWhereInput
    data: XOR<InviteUpdateManyMutationInput, InviteUncheckedUpdateManyWithoutChamaInput>
  }

  export type InviteScalarWhereInput = {
    AND?: InviteScalarWhereInput | InviteScalarWhereInput[]
    OR?: InviteScalarWhereInput[]
    NOT?: InviteScalarWhereInput | InviteScalarWhereInput[]
    id?: StringFilter<"Invite"> | string
    chamaId?: StringFilter<"Invite"> | string
    token?: StringFilter<"Invite"> | string
    sentToEmail?: StringFilter<"Invite"> | string
    expiresAt?: DateTimeFilter<"Invite"> | Date | string
    usedAt?: DateTimeNullableFilter<"Invite"> | Date | string | null
    createdAt?: DateTimeFilter<"Invite"> | Date | string
  }

  export type UserCreateWithoutMembershipsInput = {
    id?: string
    name?: string | null
    email?: string | null
    phone?: string | null
    passwordHash?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    contributions?: ContributionCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    uiSettings?: UiSettingsCreateNestedOneWithoutUserInput
    Chama?: ChamaCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateWithoutMembershipsInput = {
    id?: string
    name?: string | null
    email?: string | null
    phone?: string | null
    passwordHash?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    contributions?: ContributionUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    uiSettings?: UiSettingsUncheckedCreateNestedOneWithoutUserInput
    Chama?: ChamaUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserCreateOrConnectWithoutMembershipsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMembershipsInput, UserUncheckedCreateWithoutMembershipsInput>
  }

  export type ChamaCreateWithoutMembershipsInput = {
    id?: string
    name: string
    description?: string | null
    rules?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutChamaInput
    contributions?: ContributionCreateNestedManyWithoutChamaInput
    invites?: InviteCreateNestedManyWithoutChamaInput
  }

  export type ChamaUncheckedCreateWithoutMembershipsInput = {
    id?: string
    name: string
    description?: string | null
    rules?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    contributions?: ContributionUncheckedCreateNestedManyWithoutChamaInput
    invites?: InviteUncheckedCreateNestedManyWithoutChamaInput
  }

  export type ChamaCreateOrConnectWithoutMembershipsInput = {
    where: ChamaWhereUniqueInput
    create: XOR<ChamaCreateWithoutMembershipsInput, ChamaUncheckedCreateWithoutMembershipsInput>
  }

  export type UserUpsertWithoutMembershipsInput = {
    update: XOR<UserUpdateWithoutMembershipsInput, UserUncheckedUpdateWithoutMembershipsInput>
    create: XOR<UserCreateWithoutMembershipsInput, UserUncheckedCreateWithoutMembershipsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMembershipsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMembershipsInput, UserUncheckedUpdateWithoutMembershipsInput>
  }

  export type UserUpdateWithoutMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contributions?: ContributionUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    uiSettings?: UiSettingsUpdateOneWithoutUserNestedInput
    Chama?: ChamaUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateWithoutMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contributions?: ContributionUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    uiSettings?: UiSettingsUncheckedUpdateOneWithoutUserNestedInput
    Chama?: ChamaUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type ChamaUpsertWithoutMembershipsInput = {
    update: XOR<ChamaUpdateWithoutMembershipsInput, ChamaUncheckedUpdateWithoutMembershipsInput>
    create: XOR<ChamaCreateWithoutMembershipsInput, ChamaUncheckedCreateWithoutMembershipsInput>
    where?: ChamaWhereInput
  }

  export type ChamaUpdateToOneWithWhereWithoutMembershipsInput = {
    where?: ChamaWhereInput
    data: XOR<ChamaUpdateWithoutMembershipsInput, ChamaUncheckedUpdateWithoutMembershipsInput>
  }

  export type ChamaUpdateWithoutMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    rules?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutChamaNestedInput
    contributions?: ContributionUpdateManyWithoutChamaNestedInput
    invites?: InviteUpdateManyWithoutChamaNestedInput
  }

  export type ChamaUncheckedUpdateWithoutMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    rules?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contributions?: ContributionUncheckedUpdateManyWithoutChamaNestedInput
    invites?: InviteUncheckedUpdateManyWithoutChamaNestedInput
  }

  export type ChamaCreateWithoutInvitesInput = {
    id?: string
    name: string
    description?: string | null
    rules?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutChamaInput
    memberships?: MembershipCreateNestedManyWithoutChamaInput
    contributions?: ContributionCreateNestedManyWithoutChamaInput
  }

  export type ChamaUncheckedCreateWithoutInvitesInput = {
    id?: string
    name: string
    description?: string | null
    rules?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    memberships?: MembershipUncheckedCreateNestedManyWithoutChamaInput
    contributions?: ContributionUncheckedCreateNestedManyWithoutChamaInput
  }

  export type ChamaCreateOrConnectWithoutInvitesInput = {
    where: ChamaWhereUniqueInput
    create: XOR<ChamaCreateWithoutInvitesInput, ChamaUncheckedCreateWithoutInvitesInput>
  }

  export type ChamaUpsertWithoutInvitesInput = {
    update: XOR<ChamaUpdateWithoutInvitesInput, ChamaUncheckedUpdateWithoutInvitesInput>
    create: XOR<ChamaCreateWithoutInvitesInput, ChamaUncheckedCreateWithoutInvitesInput>
    where?: ChamaWhereInput
  }

  export type ChamaUpdateToOneWithWhereWithoutInvitesInput = {
    where?: ChamaWhereInput
    data: XOR<ChamaUpdateWithoutInvitesInput, ChamaUncheckedUpdateWithoutInvitesInput>
  }

  export type ChamaUpdateWithoutInvitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    rules?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutChamaNestedInput
    memberships?: MembershipUpdateManyWithoutChamaNestedInput
    contributions?: ContributionUpdateManyWithoutChamaNestedInput
  }

  export type ChamaUncheckedUpdateWithoutInvitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    rules?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUncheckedUpdateManyWithoutChamaNestedInput
    contributions?: ContributionUncheckedUpdateManyWithoutChamaNestedInput
  }

  export type ChamaCreateWithoutContributionsInput = {
    id?: string
    name: string
    description?: string | null
    rules?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutChamaInput
    memberships?: MembershipCreateNestedManyWithoutChamaInput
    invites?: InviteCreateNestedManyWithoutChamaInput
  }

  export type ChamaUncheckedCreateWithoutContributionsInput = {
    id?: string
    name: string
    description?: string | null
    rules?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    memberships?: MembershipUncheckedCreateNestedManyWithoutChamaInput
    invites?: InviteUncheckedCreateNestedManyWithoutChamaInput
  }

  export type ChamaCreateOrConnectWithoutContributionsInput = {
    where: ChamaWhereUniqueInput
    create: XOR<ChamaCreateWithoutContributionsInput, ChamaUncheckedCreateWithoutContributionsInput>
  }

  export type UserCreateWithoutContributionsInput = {
    id?: string
    name?: string | null
    email?: string | null
    phone?: string | null
    passwordHash?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    memberships?: MembershipCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    uiSettings?: UiSettingsCreateNestedOneWithoutUserInput
    Chama?: ChamaCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateWithoutContributionsInput = {
    id?: string
    name?: string | null
    email?: string | null
    phone?: string | null
    passwordHash?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    memberships?: MembershipUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    uiSettings?: UiSettingsUncheckedCreateNestedOneWithoutUserInput
    Chama?: ChamaUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserCreateOrConnectWithoutContributionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutContributionsInput, UserUncheckedCreateWithoutContributionsInput>
  }

  export type PaymentCreateWithoutContributionInput = {
    id?: string
    method?: $Enums.PaymentMethod
    externalRef?: string | null
    status?: $Enums.PaymentStatus
    processedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentUncheckedCreateWithoutContributionInput = {
    id?: string
    method?: $Enums.PaymentMethod
    externalRef?: string | null
    status?: $Enums.PaymentStatus
    processedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentCreateOrConnectWithoutContributionInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutContributionInput, PaymentUncheckedCreateWithoutContributionInput>
  }

  export type PaymentCreateManyContributionInputEnvelope = {
    data: PaymentCreateManyContributionInput | PaymentCreateManyContributionInput[]
    skipDuplicates?: boolean
  }

  export type ChamaUpsertWithoutContributionsInput = {
    update: XOR<ChamaUpdateWithoutContributionsInput, ChamaUncheckedUpdateWithoutContributionsInput>
    create: XOR<ChamaCreateWithoutContributionsInput, ChamaUncheckedCreateWithoutContributionsInput>
    where?: ChamaWhereInput
  }

  export type ChamaUpdateToOneWithWhereWithoutContributionsInput = {
    where?: ChamaWhereInput
    data: XOR<ChamaUpdateWithoutContributionsInput, ChamaUncheckedUpdateWithoutContributionsInput>
  }

  export type ChamaUpdateWithoutContributionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    rules?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutChamaNestedInput
    memberships?: MembershipUpdateManyWithoutChamaNestedInput
    invites?: InviteUpdateManyWithoutChamaNestedInput
  }

  export type ChamaUncheckedUpdateWithoutContributionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    rules?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUncheckedUpdateManyWithoutChamaNestedInput
    invites?: InviteUncheckedUpdateManyWithoutChamaNestedInput
  }

  export type UserUpsertWithoutContributionsInput = {
    update: XOR<UserUpdateWithoutContributionsInput, UserUncheckedUpdateWithoutContributionsInput>
    create: XOR<UserCreateWithoutContributionsInput, UserUncheckedCreateWithoutContributionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutContributionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutContributionsInput, UserUncheckedUpdateWithoutContributionsInput>
  }

  export type UserUpdateWithoutContributionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    uiSettings?: UiSettingsUpdateOneWithoutUserNestedInput
    Chama?: ChamaUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateWithoutContributionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    uiSettings?: UiSettingsUncheckedUpdateOneWithoutUserNestedInput
    Chama?: ChamaUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type PaymentUpsertWithWhereUniqueWithoutContributionInput = {
    where: PaymentWhereUniqueInput
    update: XOR<PaymentUpdateWithoutContributionInput, PaymentUncheckedUpdateWithoutContributionInput>
    create: XOR<PaymentCreateWithoutContributionInput, PaymentUncheckedCreateWithoutContributionInput>
  }

  export type PaymentUpdateWithWhereUniqueWithoutContributionInput = {
    where: PaymentWhereUniqueInput
    data: XOR<PaymentUpdateWithoutContributionInput, PaymentUncheckedUpdateWithoutContributionInput>
  }

  export type PaymentUpdateManyWithWhereWithoutContributionInput = {
    where: PaymentScalarWhereInput
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyWithoutContributionInput>
  }

  export type PaymentScalarWhereInput = {
    AND?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    OR?: PaymentScalarWhereInput[]
    NOT?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    id?: StringFilter<"Payment"> | string
    contributionId?: StringFilter<"Payment"> | string
    method?: EnumPaymentMethodFilter<"Payment"> | $Enums.PaymentMethod
    externalRef?: StringNullableFilter<"Payment"> | string | null
    status?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    processedAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    updatedAt?: DateTimeFilter<"Payment"> | Date | string
  }

  export type ContributionCreateWithoutPaymentsInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status?: $Enums.ContributionStatus
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    chama: ChamaCreateNestedOneWithoutContributionsInput
    user: UserCreateNestedOneWithoutContributionsInput
  }

  export type ContributionUncheckedCreateWithoutPaymentsInput = {
    id?: string
    chamaId: string
    userId: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status?: $Enums.ContributionStatus
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContributionCreateOrConnectWithoutPaymentsInput = {
    where: ContributionWhereUniqueInput
    create: XOR<ContributionCreateWithoutPaymentsInput, ContributionUncheckedCreateWithoutPaymentsInput>
  }

  export type ContributionUpsertWithoutPaymentsInput = {
    update: XOR<ContributionUpdateWithoutPaymentsInput, ContributionUncheckedUpdateWithoutPaymentsInput>
    create: XOR<ContributionCreateWithoutPaymentsInput, ContributionUncheckedCreateWithoutPaymentsInput>
    where?: ContributionWhereInput
  }

  export type ContributionUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: ContributionWhereInput
    data: XOR<ContributionUpdateWithoutPaymentsInput, ContributionUncheckedUpdateWithoutPaymentsInput>
  }

  export type ContributionUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumContributionStatusFieldUpdateOperationsInput | $Enums.ContributionStatus
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chama?: ChamaUpdateOneRequiredWithoutContributionsNestedInput
    user?: UserUpdateOneRequiredWithoutContributionsNestedInput
  }

  export type ContributionUncheckedUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    chamaId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumContributionStatusFieldUpdateOperationsInput | $Enums.ContributionStatus
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateWithoutTypeInput = {
    id?: string
    title: string
    body: string
    readAt?: Date | string | null
    sentAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateWithoutTypeInput = {
    id?: string
    userId: string
    title: string
    body: string
    readAt?: Date | string | null
    sentAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutTypeInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutTypeInput, NotificationUncheckedCreateWithoutTypeInput>
  }

  export type NotificationCreateManyTypeInputEnvelope = {
    data: NotificationCreateManyTypeInput | NotificationCreateManyTypeInput[]
    skipDuplicates?: boolean
  }

  export type NotificationUpsertWithWhereUniqueWithoutTypeInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutTypeInput, NotificationUncheckedUpdateWithoutTypeInput>
    create: XOR<NotificationCreateWithoutTypeInput, NotificationUncheckedCreateWithoutTypeInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutTypeInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutTypeInput, NotificationUncheckedUpdateWithoutTypeInput>
  }

  export type NotificationUpdateManyWithWhereWithoutTypeInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutTypeInput>
  }

  export type UserCreateWithoutNotificationsInput = {
    id?: string
    name?: string | null
    email?: string | null
    phone?: string | null
    passwordHash?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    memberships?: MembershipCreateNestedManyWithoutUserInput
    contributions?: ContributionCreateNestedManyWithoutUserInput
    uiSettings?: UiSettingsCreateNestedOneWithoutUserInput
    Chama?: ChamaCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateWithoutNotificationsInput = {
    id?: string
    name?: string | null
    email?: string | null
    phone?: string | null
    passwordHash?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    memberships?: MembershipUncheckedCreateNestedManyWithoutUserInput
    contributions?: ContributionUncheckedCreateNestedManyWithoutUserInput
    uiSettings?: UiSettingsUncheckedCreateNestedOneWithoutUserInput
    Chama?: ChamaUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserCreateOrConnectWithoutNotificationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
  }

  export type NotificationTypeCreateWithoutNotificationsInput = {
    name: string
    description?: string | null
    defaultDelivery: $Enums.DeliveryMethod
  }

  export type NotificationTypeUncheckedCreateWithoutNotificationsInput = {
    id?: number
    name: string
    description?: string | null
    defaultDelivery: $Enums.DeliveryMethod
  }

  export type NotificationTypeCreateOrConnectWithoutNotificationsInput = {
    where: NotificationTypeWhereUniqueInput
    create: XOR<NotificationTypeCreateWithoutNotificationsInput, NotificationTypeUncheckedCreateWithoutNotificationsInput>
  }

  export type UserUpsertWithoutNotificationsInput = {
    update: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type UserUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUpdateManyWithoutUserNestedInput
    contributions?: ContributionUpdateManyWithoutUserNestedInput
    uiSettings?: UiSettingsUpdateOneWithoutUserNestedInput
    Chama?: ChamaUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUncheckedUpdateManyWithoutUserNestedInput
    contributions?: ContributionUncheckedUpdateManyWithoutUserNestedInput
    uiSettings?: UiSettingsUncheckedUpdateOneWithoutUserNestedInput
    Chama?: ChamaUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type NotificationTypeUpsertWithoutNotificationsInput = {
    update: XOR<NotificationTypeUpdateWithoutNotificationsInput, NotificationTypeUncheckedUpdateWithoutNotificationsInput>
    create: XOR<NotificationTypeCreateWithoutNotificationsInput, NotificationTypeUncheckedCreateWithoutNotificationsInput>
    where?: NotificationTypeWhereInput
  }

  export type NotificationTypeUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: NotificationTypeWhereInput
    data: XOR<NotificationTypeUpdateWithoutNotificationsInput, NotificationTypeUncheckedUpdateWithoutNotificationsInput>
  }

  export type NotificationTypeUpdateWithoutNotificationsInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    defaultDelivery?: EnumDeliveryMethodFieldUpdateOperationsInput | $Enums.DeliveryMethod
  }

  export type NotificationTypeUncheckedUpdateWithoutNotificationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    defaultDelivery?: EnumDeliveryMethodFieldUpdateOperationsInput | $Enums.DeliveryMethod
  }

  export type UserCreateWithoutUiSettingsInput = {
    id?: string
    name?: string | null
    email?: string | null
    phone?: string | null
    passwordHash?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    memberships?: MembershipCreateNestedManyWithoutUserInput
    contributions?: ContributionCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    Chama?: ChamaCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateWithoutUiSettingsInput = {
    id?: string
    name?: string | null
    email?: string | null
    phone?: string | null
    passwordHash?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    memberships?: MembershipUncheckedCreateNestedManyWithoutUserInput
    contributions?: ContributionUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    Chama?: ChamaUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserCreateOrConnectWithoutUiSettingsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUiSettingsInput, UserUncheckedCreateWithoutUiSettingsInput>
  }

  export type UserUpsertWithoutUiSettingsInput = {
    update: XOR<UserUpdateWithoutUiSettingsInput, UserUncheckedUpdateWithoutUiSettingsInput>
    create: XOR<UserCreateWithoutUiSettingsInput, UserUncheckedCreateWithoutUiSettingsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUiSettingsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUiSettingsInput, UserUncheckedUpdateWithoutUiSettingsInput>
  }

  export type UserUpdateWithoutUiSettingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUpdateManyWithoutUserNestedInput
    contributions?: ContributionUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    Chama?: ChamaUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateWithoutUiSettingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUncheckedUpdateManyWithoutUserNestedInput
    contributions?: ContributionUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    Chama?: ChamaUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type MembershipCreateManyUserInput = {
    id?: string
    chamaId: string
    role?: $Enums.UserRole
    joinedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContributionCreateManyUserInput = {
    id?: string
    chamaId: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status?: $Enums.ContributionStatus
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationCreateManyUserInput = {
    id?: string
    typeId: number
    title: string
    body: string
    readAt?: Date | string | null
    sentAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ChamaCreateManyCreatedByInput = {
    id?: string
    name: string
    description?: string | null
    rules?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MembershipUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chama?: ChamaUpdateOneRequiredWithoutMembershipsNestedInput
  }

  export type MembershipUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    chamaId?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MembershipUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    chamaId?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContributionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumContributionStatusFieldUpdateOperationsInput | $Enums.ContributionStatus
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chama?: ChamaUpdateOneRequiredWithoutContributionsNestedInput
    payments?: PaymentUpdateManyWithoutContributionNestedInput
  }

  export type ContributionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    chamaId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumContributionStatusFieldUpdateOperationsInput | $Enums.ContributionStatus
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentUncheckedUpdateManyWithoutContributionNestedInput
  }

  export type ContributionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    chamaId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumContributionStatusFieldUpdateOperationsInput | $Enums.ContributionStatus
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: NotificationTypeUpdateOneRequiredWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    typeId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    typeId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChamaUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    rules?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUpdateManyWithoutChamaNestedInput
    contributions?: ContributionUpdateManyWithoutChamaNestedInput
    invites?: InviteUpdateManyWithoutChamaNestedInput
  }

  export type ChamaUncheckedUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    rules?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUncheckedUpdateManyWithoutChamaNestedInput
    contributions?: ContributionUncheckedUpdateManyWithoutChamaNestedInput
    invites?: InviteUncheckedUpdateManyWithoutChamaNestedInput
  }

  export type ChamaUncheckedUpdateManyWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    rules?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MembershipCreateManyChamaInput = {
    id?: string
    userId: string
    role?: $Enums.UserRole
    joinedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContributionCreateManyChamaInput = {
    id?: string
    userId: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status?: $Enums.ContributionStatus
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InviteCreateManyChamaInput = {
    id?: string
    token: string
    sentToEmail: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MembershipUpdateWithoutChamaInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMembershipsNestedInput
  }

  export type MembershipUncheckedUpdateWithoutChamaInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MembershipUncheckedUpdateManyWithoutChamaInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContributionUpdateWithoutChamaInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumContributionStatusFieldUpdateOperationsInput | $Enums.ContributionStatus
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutContributionsNestedInput
    payments?: PaymentUpdateManyWithoutContributionNestedInput
  }

  export type ContributionUncheckedUpdateWithoutChamaInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumContributionStatusFieldUpdateOperationsInput | $Enums.ContributionStatus
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentUncheckedUpdateManyWithoutContributionNestedInput
  }

  export type ContributionUncheckedUpdateManyWithoutChamaInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumContributionStatusFieldUpdateOperationsInput | $Enums.ContributionStatus
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InviteUpdateWithoutChamaInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    sentToEmail?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InviteUncheckedUpdateWithoutChamaInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    sentToEmail?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InviteUncheckedUpdateManyWithoutChamaInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    sentToEmail?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCreateManyContributionInput = {
    id?: string
    method?: $Enums.PaymentMethod
    externalRef?: string | null
    status?: $Enums.PaymentStatus
    processedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentUpdateWithoutContributionInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    externalRef?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateWithoutContributionInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    externalRef?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateManyWithoutContributionInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    externalRef?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyTypeInput = {
    id?: string
    userId: string
    title: string
    body: string
    readAt?: Date | string | null
    sentAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NotificationUpdateWithoutTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateWithoutTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ChamaCountOutputTypeDefaultArgs instead
     */
    export type ChamaCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ChamaCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ContributionCountOutputTypeDefaultArgs instead
     */
    export type ContributionCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ContributionCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NotificationTypeCountOutputTypeDefaultArgs instead
     */
    export type NotificationTypeCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NotificationTypeCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ChamaDefaultArgs instead
     */
    export type ChamaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ChamaDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MembershipDefaultArgs instead
     */
    export type MembershipArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MembershipDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InviteDefaultArgs instead
     */
    export type InviteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InviteDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ContributionDefaultArgs instead
     */
    export type ContributionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ContributionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PaymentDefaultArgs instead
     */
    export type PaymentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PaymentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NotificationTypeDefaultArgs instead
     */
    export type NotificationTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NotificationTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NotificationDefaultArgs instead
     */
    export type NotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NotificationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UiSettingsDefaultArgs instead
     */
    export type UiSettingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UiSettingsDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}