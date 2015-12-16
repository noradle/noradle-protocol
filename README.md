

+----------------------------------+
|  slotID        | fType | flags  |
+----------------------------------+
|           Length (32 bits)       |
+----------------------------------+
|               Data               |
+----------------------------------+

SlotID = 0 denote control frame.


* slotID
  - for client to dispatcher: slotID is cSlotID, denote which client access path slot used to send frames 
  - for dispatcher to oracle: slotID is oSlotID, denote which server process slot used to send frames
  - SlotID = 0 denote control frame
* fType is frame Type, such as:
  - head frame: denote begining of a request
  - body frame: denote end of a request or response
* Length is the byte length for Data.
* Data is payload