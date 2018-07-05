local entity = {}


-- Metadata abpout each component type, keyed by component type name. See `entity.newComponentType`
-- below for format.
local componentInfos = {}

-- Create a new component type with name `name`. `opts` is a table of the following options:
--    - `depends`: Array of names of other component types this componnet requires in the entity
function entity.newComponentType(name, opts)
    if componentInfos[name] then
        error("component type with name '" .. name .. "' already exists!")
    end
    opts = opts or {}

    local info = {}

    -- Initialize `depends` table
    info.depends = opts.depends
    if info.depends == nil then
        info.depends = {}
    elseif type(info.depends) ~= 'table' then
        info.depends = { info.depends }
    end

    -- Initialize `methods` table
    info.methods = {}

    componentInfos[name] = info
    return info.methods
end


-- Map such that `entities[ent] == ent` for all entities `ent`
local entities = {}

local entityMethods = {}

local entityMeta = {
    __index = entityMethods,

    -- Disable adding keys directly in the entity
    __newindex = function(t, k, v)
        error("attempted to directly set key '" .. k .. "' in entity -- please store data in " ..
            "a component inside the entity instead")
    end
}

function entity.newEntity()
    local ent = {}
    setmetatable(ent, entityMeta)
    entities[ent] = ent
    return ent
end

function entityMethods:destroy()
    rawset(self, 'destroyed', true)
    for _, component in pairs(self) do
        if component.remove then
            component:remove()
        end
    end
    entities[self] = nil
end

function entityMethods:addComponent(componentType)
    local info = assert(componentInfos[componentType],
        "no component type with name '" .. componentType .. "'")

    -- Already added?
--    local key = componentType:gsub('^.', string.lower)
    local key = componentType
    if self[key] then return end

    -- Add dependencies
    for _, dep in ipairs(info.depends) do
        self:addComponent(dep)
    end

    -- Create and add to entity
    local component = setmetatable({}, {
        __index = info.methods,
    })
    rawset(self, key, component)

    -- Link dependencies
    for _, dep in ipairs(info.depends) do
        component[dep] = self[dep]
    end

    -- Initialize and call `add` method
    component.ent = self
    if component.add then
        component:add()
    end

    -- Notify dependencies
    for _, dep in ipairs(info.depends) do
        if self[dep].addDependent then
            self[dep]:addDependent(componentType)
        end
    end
end


return entity