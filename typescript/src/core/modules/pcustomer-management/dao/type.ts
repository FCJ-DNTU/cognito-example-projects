import type { TInternalContext } from "../../../context/internal-context";

export type TPCustomer = {
  id: string;
  fullName: string;
  phone: string;
  age: number;
  type: string;
  productCode: string;
  createAt: string;
};

export type TFindPCustomerQuery = {
  id: string;
};

export type TFindPCustomerParams = {
  query?: TFindPCustomerQuery;
  indexName?: string;
  limit?: string;
  staryKey?: string;
};

export type TFindPCustomerResult = {
  items: Array<TPCustomer>;
  meta: {
    size: number;
    lastKey?: string;
  };
};

export type TDeletePCustomerQuery = TFindPCustomerQuery;

export type TDeletePCustomerParams = {
  query: TDeletePCustomerQuery;
};

export interface IPCustomerDAO {
  /**
   * Tìm các khác hàng tiềm năng trong hệ thống.
   *
   * @param ctx - internal context.
   *
   * @returns
   */
  listPCustomers(
    ctx: TInternalContext<Partial<TFindPCustomerParams>>,
  ): Promise<TFindPCustomerResult | undefined>;

  /**
   * Tìm thông tin của một khách hàng trong hệ thống.
   *
   * @param ctx - internal context.
   *
   * @returns
   */
  getPCustomer(
    ctx: TInternalContext<Partial<TFindPCustomerParams>>,
  ): Promise<TPCustomer | undefined>;

  /**
   * Thêm thông tin của một khách hàng tiềm năng vào trong danh sách.
   *
   * @param ctx - internal context.
   *
   * @returns
   */
  insertPCustomer(
    ctx: TInternalContext<Partial<TPCustomer>>,
  ): Promise<TPCustomer | undefined>;

  /**
   * Cập nhật thông tin của một khách hàng trong hệ thống.
   *
   * @param ctx - internal context.
   *
   * @returns
   */
  updatePCustomer(
    ctx: TInternalContext<Partial<TPCustomer>>,
  ): Promise<Partial<TPCustomer> | undefined>;

  /**
   * Xoá thông tin của một khách hàng tiềm năng trong hệ thống.
   *
   * @param ctx - internal context.
   *
   * @returns
   */
  deletePCustomer(ctx: TInternalContext<TDeletePCustomerParams>): Promise<any>;
}
