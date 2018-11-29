-- From 'Lua Lexer' at http://lua-users.org/wiki/LpegRecipes.
-- With long string matcher from http://www.inf.puc-rio.br/~roberto/lpeg/ because
-- the original one caused an LPeg zero-length loop error.

local lpeg = require 'lpeg'
local P, R, S, C, Cc, Ct = lpeg.P, lpeg.R, lpeg.S, lpeg.C, lpeg.Cc, lpeg.Ct

-- create a pattern which captures the lua value [id] and the input matching
-- [patt] in a table
local function token(id, patt) return Ct(Cc(id) * C(patt)) end

local digit = R('09')

-- range of valid characters after first character of identifier
local idsafe = R('AZ', 'az', '\127\255') + P '_'

-- operators
local operator = token('operator', P '==' + P '~=' + P '<=' + P '>=' + P '...'
        + P '..' + S '+-*/%^#=<>;:,.{}[]()')
-- identifiers
local ident = token('identifier', idsafe * (idsafe + digit + P '.') ^ 0)

-- keywords
local keyword = token('keyword', (P 'and' + P 'break' + P 'do' + P 'else' +
        P 'elseif' + P 'end' + P 'false' + P 'for' + P 'function' + P 'if' +
        P 'in' + P 'local' + P 'nil' + P 'not' + P 'or' + P 'repeat' + P 'return' +
        P 'then' + P 'true' + P 'until' + P 'while') * -(idsafe + digit))

-- numbers
local number_sign = S'+-'^-1
local number_decimal = digit ^ 1
local number_hexadecimal = P '0' * S 'xX' * R('09', 'AF', 'af') ^ 1
local number_float = (digit^1 * P'.' * digit^0 + P'.' * digit^1) *
        (S'eE' * number_sign * digit^1)^-1
local number = token('number', number_hexadecimal +
        number_float +
        number_decimal)

-- callback for [=[ long strings ]=]
-- ps. LPeg is for Lua what regex is for Perl, which makes me smile :)
local longstring
do
    local equals = lpeg.P"="^0
    local open = "[" * lpeg.Cg(equals, "init") * "[" * lpeg.P"\n"^-1
    local close = "]" * lpeg.C(equals) * "]"
    local closeeq = lpeg.Cmt(close * lpeg.Cb("init"), function (s, i, a, b) return a == b end)
    longstring = open * lpeg.C((lpeg.P(1) - closeeq)^0) * close / 1
end

-- strings
local singlequoted_string = P "'" * ((1 - S "'\r\n\f\\") + (P '\\' * 1)) ^ 0 * "'"
local doublequoted_string = P '"' * ((1 - S '"\r\n\f\\') + (P '\\' * 1)) ^ 0 * '"'
local string = token('string', singlequoted_string +
        doublequoted_string +
        longstring)

-- comments
local singleline_comment = P '--' * (1 - S '\r\n\f') ^ 0
local multiline_comment = P '--' * longstring
local comment = token('comment', multiline_comment + singleline_comment)

-- whitespace
local whitespace = token('whitespace', S('\r\n\f\t ')^1)

-- ordered choice of all tokens and last-resort error which consumes one character
local any_token = whitespace + number + keyword + ident +
        string + comment + operator + token('error', 1)

-- private interface
local table_of_tokens = Ct(any_token ^ 0)

-- increment [line] by the number of line-ends in [text]
local function sync(line, text)
    local index, limit = 1, #text
    while index <= limit do
        local start, stop = text:find('\r\n', index, true)
        if not start then
            start, stop = text:find('[\r\n\f]', index)
            if not start then break end
        end
        index = stop + 1
        line = line + 1
    end
    return line
end

-- we only need to synchronize the line-counter for these token types
local multiline_tokens = { comment = true, string = true, whitespace = true }

-- public interface
return function(input)
    assert(type(input) == 'string', 'bad argument #1 (expected string)')
    local line = 1
    local tokens = lpeg.match(table_of_tokens, input)
    for i, token in pairs(tokens) do
        token[3] = line
        if multiline_tokens[token[1]] then line = sync(line, token[2]) end
    end
    return tokens
end
