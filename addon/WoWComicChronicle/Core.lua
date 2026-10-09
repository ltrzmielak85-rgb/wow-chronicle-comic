local f = CreateFrame("Frame")
local function now() return time() end
local function emit(kind, payload)
  if not WCC_DB then return end
  WCC_DB.seq = (WCC_DB.seq or 0) + 1
  local e = {seq=WCC_DB.seq, ts=now(), kind=kind, data=payload or {}}
  table.insert(WCC_DB.events, e)
  if #WCC_DB.events > 5000 then table.remove(WCC_DB.events, 1) end
end
local function questInfo(i)
  if C_QuestLog and C_QuestLog.GetInfo then
    local x=C_QuestLog.GetInfo(i)
    if x and not x.isHeader then return x.questID, x.title, x.isComplete end
  end
  if GetQuestLogTitle then
    local title,_,_,isHeader,_,isComplete,_,id=GetQuestLogTitle(i)
    if not isHeader then return id,title,isComplete end
  end
end
local function scan()
  if not WCC_DB then return end
  local seen={}
  local count=(C_QuestLog and C_QuestLog.GetNumQuestLogEntries and C_QuestLog.GetNumQuestLogEntries()) or (GetNumQuestLogEntries and GetNumQuestLogEntries()) or 0
  for i=1,count do
    local id,title,complete=questInfo(i)
    if id and title then
      local key=tostring(id)
      seen[key]=true
      local state=complete and "complete" or "active"
      local old=WCC_DB.quests[key]
      if not old then
        WCC_DB.quests[key]={title=title,state=state,firstSeen=now()}
        emit("QUEST_SEEN",{id=id,title=title,state=state})
      elseif old.state ~= state then
        old.state=state
        emit("QUEST_STATE",{id=id,title=title,state=state})
      end
    end
  end
  WCC_DB.lastScan=now()
end
f:RegisterEvent("PLAYER_LOGIN")
f:RegisterEvent("QUEST_LOG_UPDATE")
f:RegisterEvent("QUEST_ACCEPTED")
f:RegisterEvent("QUEST_TURNED_IN")
f:RegisterEvent("ZONE_CHANGED_NEW_AREA")
f:RegisterEvent("PLAYER_REGEN_DISABLED")
f:RegisterEvent("PLAYER_REGEN_ENABLED")
f:RegisterEvent("GOSSIP_SHOW")
f:RegisterEvent("QUEST_DETAIL")
f:RegisterEvent("PLAYER_LEVEL_UP")
f:SetScript("OnEvent",function(_,event,...)
  if event=="PLAYER_LOGIN" then
    WCC_DB=WCC_DB or {events={},quests={},seq=0}
    WCC_DB.events=WCC_DB.events or {}
    WCC_DB.quests=WCC_DB.quests or {}
    WCC_DB.seq=WCC_DB.seq or 0
    print("|cff66ccff[WCC]|r TBC Anniversary recorder ready. /wcc")
    scan()
  elseif event=="QUEST_LOG_UPDATE" then scan()
  elseif event=="QUEST_ACCEPTED" then
    local a,b=...
    emit(event,{questID=b or a})
    scan()
  elseif event=="QUEST_TURNED_IN" then
    local id=...
    emit(event,{questID=id})
    local q=WCC_DB.quests[tostring(id)]
    if q then q.state="turned_in" end
  elseif event=="ZONE_CHANGED_NEW_AREA" then
    emit(event,{zone=GetRealZoneText(),subzone=GetSubZoneText()})
  elseif event=="PLAYER_LEVEL_UP" then
    emit(event,{level=(...)})
  else
    emit(event,{zone=GetRealZoneText()})
  end
end)
SLASH_WCC1="/wcc"
SlashCmdList.WCC=function(msg)
  msg=(msg or ""):lower()
  if msg=="scan" then scan(); print("[WCC] Scan completed.")
  elseif msg=="status" then
    print("[WCC] Quests: "..tostring((function() local n=0 for _ in pairs(WCC_DB.quests) do n=n+1 end return n end)()).." Events: "..#WCC_DB.events)
  elseif msg=="quests" then
    for id,q in pairs(WCC_DB.quests) do print("[WCC] "..id.." "..q.title.." ("..q.state..")") end
  elseif msg=="debug" then
    print("[WCC] Build: "..tostring(select(4,GetBuildInfo())).." C_QuestLog: "..tostring(C_QuestLog~=nil))
  else print("[WCC] /wcc status | quests | scan | debug") end
end
