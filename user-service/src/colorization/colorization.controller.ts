import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ColorizationService } from './colorization.service';
  import { Express } from 'express';
  import {
    ApiConsumes,
    ApiBody,
    ApiTags,
    ApiResponse,
  } from '@nestjs/swagger';
  
  @ApiTags('Colorization') // Название секции в Swagger UI
  @Controller('colorize')
  export class ColorizationController {
    constructor(private readonly colorizationService: ColorizationService) {}
  
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
        required: ['file'],
      },
    })
    @ApiResponse({ status: 201, description: 'Успешно колоризировано' })
    @ApiResponse({ status: 400, description: 'Файл обязателен или некорректный формат' })
    async colorize(@UploadedFile() file: Express.Multer.File) {
      if (!file) {
        throw new BadRequestException('Файл обязателен');
      }
  
      return this.colorizationService.enqueue(file);
    }
  }
  