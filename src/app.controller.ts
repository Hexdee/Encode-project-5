import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

export class claimTokenDTO {
  address: string;
}

export class voteDTO {
  voter: string;
  proposal: string;
  amount: number;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('claim-tokens')
  claimTokens(@Body() body: claimTokenDTO) {
    return this.appService.claimTokens(body.address);
  }

  @Post('save-vote')
  saveVote(@Body() body: voteDTO) {
    return this.appService.saveVote(body.voter, body.proposal, body.amount);
  }

  @Get('votes/:limit/:offset')
  getVotes(@Param('limit') limit: number, @Param('offset') offset: number) {
    return this.appService.getVotes(limit, offset);
  }
}
