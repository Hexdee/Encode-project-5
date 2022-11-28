import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { ethers } from 'ethers';
import { voteDTO } from './app.controller';
import * as MyToken from './assets/MyToken.json';

@Injectable()
export class AppService {
  provider: ethers.providers.BaseProvider;
  tokenContract: ethers.Contract;
  votes: voteDTO[];

  constructor(private configService: ConfigService) {
    this.votes = new Array();
    this.provider = ethers.getDefaultProvider('goerli');
    //TODO: get private key from .env using ConfigService
    const privateKey: string = this.configService.get<string>('PRIVATE_KEY');
    console.log(privateKey);
    const contractAddress: string = this.configService.get<string>('CONTRACT_ADDRESS');
    console.log(contractAddress);
    const wallet = new ethers.Wallet(privateKey);
    const signer = wallet.connect(this.provider);
    this.tokenContract = new ethers.Contract(contractAddress, MyToken.abi, signer);
  }

  async claimTokens(address: string) {
    //Mint 10 tokens to address
    const mintTx = await this.tokenContract.mint(address, ethers.utils.parseEther("10"));
    const mintTxResponse = await mintTx.wait();
    const txStatus = mintTxResponse.status;
    if (txStatus == 0) {
      return { success: false, message: `Failed to mint tokens for address: ${address}` }
    }
    return { success: true, message: `Successfully minted 10 tokens for address: ${address}` };
  }

  saveVote(voter: string, proposal: string, amount: number) {
    this.votes.push({ voter, proposal, amount });
    return { success: true, message: `votes successfully saved` }
  }

  getVotes(limit: number | undefined, offset: number | undefined) {
    // Returns last 10 votes by default
    if (limit && offset) {
      return this.votes.slice(offset, limit + offset);
    } else if (limit) {
      return this.votes.slice(0, limit);
    } else {
      return this.votes.slice(0, 10);
    }
  }
} 
