/* This file was auto-generated by MC-GENERATOR, DO NOT modify it manually */
/* eslint-disable */
import { ObjectType, Field, Resolver, registerEnumType } from "type-graphql";
import { GraphQLScalarType } from "graphql";
import { mockEnum } from "mockPackage";

@ObjectType()
export class MockLayer {
    @Field({ nullable: true })
    public source?: string;
    @Field({ nullable: true })
    public id?: string;
    @Field((type) => mockEnum, { nullable: true })
    public mockEnum?: mockEnum;
    @Field((type) => mockScalarObject, { nullable: true })
    public mockScalar?: string;
    @Field((type) => [String], { nullable: true })
    public stringArray?: String[];
}

export const mockScalarObject = new GraphQLScalarType({ name: "mockScalarObject"});

@Resolver(MockLayer)
export class MockLayerResolver {
}

const mockEnumRegister = registerEnumType(mockEnum, {name: "mockEnum"});
