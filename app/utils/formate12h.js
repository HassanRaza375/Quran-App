export function format12h(time) {
    if (!time) return ''
    const [h, m] = time.split(':').map(Number)

    const d = new Date()
    d.setHours(h, m, 0, 0)

    return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })
}
