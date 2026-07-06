import { StringOption } from 'necord'

export class TestCommandDto {
  @StringOption({
    name: 'param',
    description: 'Test command',
    required: true,
  })
  param: string
}
