import { Request, Response } from "express"
import { asyncHandler } from "../../common/utils/asyncHandler"
import { ApiResponse } from "../../common/utils/apiResponse"
import collaborationRepository from "./collaboration.repository"
import type {
  CreateExpenseGroupDTO,
  CreateInviteDTO,
  CreateSharedAccountDTO,
  UpdateMemberRoleDTO,
} from "./collaboration.types"

export const getInviteUsersDashboard = asyncHandler(async (req: Request, res: Response) => {
  const data = await collaborationRepository.getInviteUsersDashboard(req.user!.id)
  ApiResponse.success(data, res)
})

export const createInvite = asyncHandler(async (req: Request, res: Response) => {
  const invite = await collaborationRepository.createInvite(req.user!.id, req.body as CreateInviteDTO)
  ApiResponse.success(invite, res, 201)
})

export const resendInvite = asyncHandler(async (req: Request, res: Response) => {
  const invite = await collaborationRepository.resendInvite(req.user!.id, req.params.id as string)
  ApiResponse.success(invite, res)
})

export const cancelInvite = asyncHandler(async (req: Request, res: Response) => {
  await collaborationRepository.cancelInvite(req.user!.id, req.params.id as string)
  ApiResponse.success({ cancelled: true }, res)
})

export const updateTeamMemberRole = asyncHandler(async (req: Request, res: Response) => {
  const member = await collaborationRepository.updateTeamMemberRole(
    req.user!.id,
    req.params.id as string,
    (req.body as UpdateMemberRoleDTO).role,
  )
  ApiResponse.success(member, res)
})

export const removeTeamMember = asyncHandler(async (req: Request, res: Response) => {
  await collaborationRepository.removeTeamMember(req.user!.id, req.params.id as string)
  ApiResponse.success({ removed: true }, res)
})

export const getSharedAccountsDashboard = asyncHandler(async (req: Request, res: Response) => {
  const data = await collaborationRepository.getSharedAccountsDashboard(req.user!.id)
  ApiResponse.success(data, res)
})

export const createSharedAccount = asyncHandler(async (req: Request, res: Response) => {
  const account = await collaborationRepository.createSharedAccount(req.user!.id, req.body as CreateSharedAccountDTO)
  ApiResponse.success(account, res, 201)
})

export const updateSharedAccountMemberRole = asyncHandler(async (req: Request, res: Response) => {
  const data = await collaborationRepository.updateSharedAccountMemberRole(
    req.user!.id,
    req.params.accountId as string,
    req.params.memberId as string,
    (req.body as UpdateMemberRoleDTO).role,
  )
  ApiResponse.success(data, res)
})

export const removeSharedAccountMember = asyncHandler(async (req: Request, res: Response) => {
  const data = await collaborationRepository.removeSharedAccountMember(
    req.user!.id,
    req.params.accountId as string,
    req.params.memberId as string,
  )
  ApiResponse.success(data, res)
})

export const leaveSharedAccount = asyncHandler(async (req: Request, res: Response) => {
  const data = await collaborationRepository.leaveSharedAccount(req.user!.id, req.params.accountId as string)
  ApiResponse.success(data, res)
})

export const getExpenseGroupsDashboard = asyncHandler(async (req: Request, res: Response) => {
  const data = await collaborationRepository.getExpenseGroupsDashboard(req.user!.id)
  ApiResponse.success(data, res)
})

export const createExpenseGroup = asyncHandler(async (req: Request, res: Response) => {
  const group = await collaborationRepository.createExpenseGroup(req.user!.id, req.body as CreateExpenseGroupDTO)
  ApiResponse.success(group, res, 201)
})
