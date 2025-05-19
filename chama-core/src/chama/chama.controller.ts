import { Controller, Get, Post, Body, Param, UseGuards, Headers } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChamaService } from './chama.service';
import { CreateChamaDto } from './dto/create-chama.dto';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('chama')
@Controller('chama')
export class ChamaController {
  constructor(private readonly chamaService: ChamaService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new chama' })
  @ApiResponse({ status: 201, description: 'The chama has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() createChamaDto: CreateChamaDto, @Headers('authorization') authHeader: string) {
    const token = authHeader.split(' ')[1];
    return this.chamaService.create(createChamaDto, token);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all chamas for the logged-in user' })
  @ApiResponse({ status: 200, description: 'Return all chamas.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(@Headers('authorization') authHeader: string) {
    const token = authHeader.split(' ')[1];
    return this.chamaService.findAll(token);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a chama by ID' })
  @ApiResponse({ status: 200, description: 'Return the chama.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Chama not found.' })
  findOne(@Param('id') id: string, @Headers('authorization') authHeader: string) {
    const token = authHeader.split(' ')[1];
    return this.chamaService.findOne(id, token);
  }
}

