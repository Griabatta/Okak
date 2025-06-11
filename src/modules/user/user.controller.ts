import { Body, Controller, ForbiddenException, Post, Req, UseGuards } from "@nestjs/common";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "@prisma/client";
import { UserService } from "./user.service";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";


@Controller()
export class UserController {

    constructor (
        private readonly userService: UserService
    ) {}

    @Post('promote-to-leader')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    async promoteToLeader(
    @Body() body: { newLeaderEmail: string, oldLeaderEmail?: string },
    @Req() req,
    ) {
    // Проверяем, что преподаватель пытается назначить старосту в своей группе
    if (req.user.role === UserRole.TEACHER) {
        const group = await this.userService.getUserGroupByEmail(body.newLeaderEmail);
        if (!group || group.institutionId !== req.user.institutionId) {
        throw new ForbiddenException('You can only promote students in your institution');
        }
    }
    
    return this.userService.promoteToLeader(
        body.newLeaderEmail,
        body.oldLeaderEmail
    );
    }
}