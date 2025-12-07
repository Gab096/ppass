import app from '@adonisjs/core/services/app'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { randomBytes } from 'node:crypto'
import { join } from 'node:path'
import { existsSync, mkdirSync } from 'node:fs'

export default class FileUploadService {
  private readonly uploadsPath = 'public/uploads'
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/tif',
    'image/heic',
    'image/heif',
    'image/svg+xml',
  ]
  private readonly allowedExtensions = [
    'jpg',
    'jpeg',
    'png',
    'webp',
    'gif',
    'bmp',
    'tiff',
    'tif',
    'heic',
    'heif',
    'svg',
  ]
  private readonly maxSize = 10 * 1024 * 1024 // 10MB (aumentado para acomodar formatos maiores)

  /**
   * Salva um arquivo de upload e retorna o caminho relativo
   */
  async saveProfilePhoto(file: MultipartFile, folder: 'inmates' | 'visitors'): Promise<string> {
    // Validar tipo de arquivo por MIME type
    const fileMimeType = file.type || ''
    const fileExtension = (file.extname || '').toLowerCase().replace('.', '')
    
    const isValidMimeType = this.allowedMimeTypes.includes(fileMimeType)
    const isValidExtension = this.allowedExtensions.includes(fileExtension)
    
    if (!isValidMimeType && !isValidExtension) {
      throw new Error(
        `Tipo de arquivo não permitido. Formatos aceitos: ${this.allowedExtensions.join(', ').toUpperCase()}.`
      )
    }

    // Validar tamanho
    if (file.size > this.maxSize) {
      throw new Error(`Arquivo muito grande. Tamanho máximo: ${this.maxSize / (1024 * 1024)}MB.`)
    }

    // Criar diretório se não existir
    const folderPath = join(app.makePath(this.uploadsPath), folder)
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, { recursive: true })
    }

    // Gerar nome único para o arquivo
    // Garantir que a extensão comece com ponto
    let extension = file.extname || '.jpg'
    if (!extension.startsWith('.')) {
      extension = `.${extension}`
    }
    const fileName = `${randomBytes(16).toString('hex')}${extension}`

    // Mover arquivo
    await file.move(folderPath, { name: fileName })

    // Retornar caminho relativo para acesso via URL
    return `/uploads/${folder}/${fileName}`
  }

  /**
   * Remove um arquivo de upload
   */
  async deleteProfilePhoto(photoPath: string | null): Promise<void> {
    if (!photoPath) {
      return
    }

    // Remover /uploads/ do início do caminho
    const relativePath = photoPath.startsWith('/uploads/')
      ? photoPath.substring(1)
      : photoPath

    const fullPath = join(app.makePath('public'), relativePath)

    if (existsSync(fullPath)) {
      const { unlink } = await import('node:fs/promises')
      await unlink(fullPath)
    }
  }
}

