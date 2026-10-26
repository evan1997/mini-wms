import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from "typeorm";
@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid") id!: string;
  @Column({ unique: true }) username!: string;
  @Column() passwordHash!: string;
}
@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid") id!: string;
  @Column({ unique: true }) sku!: string;
  @Column() name!: string;
  @Column({ default: "pcs" }) unit!: string;
}
@Entity("locations")
export class Location {
  @PrimaryGeneratedColumn("uuid") id!: string;
  @Column({ unique: true }) code!: string;
  @Column({ default: "" }) description!: string;
}
@Entity("stock")
@Index(["productId", "locationId"], { unique: true })
export class Stock {
  @PrimaryGeneratedColumn("uuid") id!: string;
  @Column("uuid") productId!: string;
  @Column("uuid") locationId!: string;
  @Column("integer", { default: 0 }) quantity!: number;
}
@Entity("movements")
export class Movement {
  @PrimaryGeneratedColumn("uuid") id!: string;
  @Column({ unique: true }) reference!: string;
  @Column() type!: string;
  @Column("uuid") productId!: string;
  @Column("uuid", { nullable: true }) fromLocationId!: string | null;
  @Column("uuid", { nullable: true }) toLocationId!: string | null;
  @Column("integer") quantity!: number;
  @Column("uuid") operatorId!: string;
  @CreateDateColumn() createdAt!: Date;
}
