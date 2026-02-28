const { createRootMock, renderMock } = vi.hoisted(() => {
  return {
    createRootMock: vi.fn(() => ({ render: vi.fn() })),
    renderMock: vi.fn()
  }
})

createRootMock.mockReturnValue({ render: renderMock })

vi.mock('react-dom/client', () => ({
  default: {
    createRoot: createRootMock
  }
}))

vi.mock('./App.tsx', () => ({
  default: () => <div>App</div>
}))

describe('main entry', () => {
  beforeEach(() => {
    vi.resetModules()
    document.body.innerHTML = '<div id="root"></div>'
    createRootMock.mockClear()
    renderMock.mockClear()
  })

  it('creates a root and renders the app', async () => {
    await import('./main.tsx')

    expect(createRootMock).toHaveBeenCalledWith(document.getElementById('root'))
    expect(renderMock).toHaveBeenCalledTimes(1)
  })
})