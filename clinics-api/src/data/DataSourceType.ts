export interface DataSource<Input, Output> {
  name: string
  getData: (data?: Input) => Promise<Output>
}
