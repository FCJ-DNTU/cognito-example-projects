import type { AttributeValue } from "@aws-sdk/client-dynamodb";
import type { TInternalContext } from "../../../context/internal-context";
import type {
  TPartitionQuery,
  TSortQuery,
} from "../../../../utils/dynamodb/type";

export type TPCustomer = {
  id: string;
  fullName: string;
  phone: string;
  age: number;
  productCode: string;
  createAt: string;
};

export type TFindPCustomerQuery = {
  pk: TPartitionQuery;
  sk: TSortQuery;
};

export type TFindPCustomerParams = {
  query: TFindPCustomerQuery;
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
   * Thêm thông tin của một khách hàng tiềm năng vào trong danh sách.
   *
   * @param ctx - internal context.
   *
   * @returns
   */
  insertPCustomer(
    ctx: TInternalContext<TPCustomer>,
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
