interface IKun {
  name: string;
  age: number;
  slogan?: string;
}

// 类型体操
type HYPartial<T> = {
  [P in keyof T]?: T[P];
};

// IKun都变成可选的
type IKunOptional = HYPartial<IKun>;

interface IPerson {
  name: string;
  age: number;
  address?: string;
}
type aa = Partial<IPerson>;

export {};
