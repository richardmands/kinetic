import {
  ApiAuthDataAccessService,
  ApiAuthGraphqlGuard,
  AuthToken,
  CtxUser,
  LoginInput,
} from '@mogami/api/auth/data-access'
import { User } from '@mogami/api/user/data-access'
import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

@Resolver()
export class ApiAuthFeatureResolver {
  constructor(private readonly service: ApiAuthDataAccessService) {}

  @Mutation(() => AuthToken, { nullable: true })
  async login(@Context() context, @Args('input') input: LoginInput) {
    return this.service.login(context.res, input)
  }

  @Mutation(() => Boolean, { nullable: true })
  async logout(@Context() context) {
    this.service.resetCookie(context.res)
    return true
  }

  @Query(() => User, { nullable: true })
  @UseGuards(ApiAuthGraphqlGuard)
  me(@CtxUser() user: User) {
    return user
  }
}
