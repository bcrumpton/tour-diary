# Concepts to Review

## React

### useEffect hook
- **Dependencies array**: Controls when the effect runs
  - `[]` = run once on mount
  - `[value]` = run when value changes
  - no array = run on every render (usually not what you want)
- **Cleanup function**: Return a function to clean up (clear timers, unsubscribe, etc.)
  ```jsx
  useEffect(() => {
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);  // cleanup
  }, [message]);
  ```

### Passing children to components
- Use the `children` prop to pass content between component tags
  ```jsx
  // Parent
  <Modal>{content here}</Modal>

  // Modal component
  function Modal({ children }) {
    return <div className="modal">{children}</div>
  }
  ```

### onClick handlers
- `onClick={fn}` - passes function reference (correct for no-arg functions)
- `onClick={fn(arg)}` - WRONG: calls function immediately during render
- `onClick={() => fn(arg)}` - correct: passes function that calls fn when clicked

### Conditional rendering
- `{condition && <Component />}` - renders Component only if condition is truthy
- `{value ? <A /> : <B />}` - ternary for either/or rendering

### Modal state patterns
- Boolean state for simple open/close: `useState(false)`
- Object state when you need to track "which item": `useState(null)` then set to the selected item

## JavaScript

### Array .map() third parameter
- `.map((item, index, array) => ...)` - third param gives access to the full array
- Useful for checking if you're on the last item: `index !== array.length - 1`

### Arrow function return
- Implicit return (no braces): `() => value`
- Explicit return (with braces): `() => { return value }`
- Common bug: `() => { value }` returns undefined (missing return)

### Object.entries / Object.fromEntries
- `Object.entries(obj)` - converts object to array of [key, value] pairs
- `Object.fromEntries(arr)` - converts array of [key, value] pairs back to object
- Useful for filtering object properties:
  ```jsx
  const filtered = Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => value !== null)
  );
  ```

### String .split() with regex
- `/\r?\n/` - matches `\r\n` (Windows) OR `\n` (Unix) newlines
- More robust than hardcoding `'\r\n'` or `'\n'`

## PocketBase

### update() behavior
- Only updates fields you include in the data object
- Sending `null` explicitly removes the field
- To preserve existing values, filter out null/empty before sending

## CSS

### backdrop-filter: blur()
- Only works if the element has transparency (e.g., `rgba(0,0,0,0.5)`)
- Won't show blur effect with fully opaque backgrounds

---

# TODO

## Deployment
- [ ] Set up environment variable for PocketBase URL (dev vs production)
- [ ] Set up PocketBase container on Unraid
  - Image: `ghcr.io/muchobien/pocketbase:latest`
  - Map volume for `/pb_data`
  - Expose port 8090
- [ ] Build React app (`npm run build`)
- [ ] Set up nginx or static file server container on Unraid for frontend
- [ ] Configure reverse proxy (Nginx Proxy Manager) for domain name
- [ ] Migrate local PocketBase data to production
